import { useEffect, useRef, useState } from 'react';
import { TextField, Stack, Avatar, Button, Typography, Box, FormControlLabel, Checkbox } from '@mui/material';
import { Company } from 'api/companyService';
import CommonDialog from 'components/Dialog/GenericDialog';
import { useFormHandler } from 'hooks/useFormHandler';

interface CompanyFormProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: FormData | Partial<Company>) => Promise<{ code: number; message: string }>;
	initialData?:
		| (Company & {
				avatarUrl?: string | null;
				bankAttachmentUrl?: string | null;
		  })
		| null;
	onSuccess?: (code: number, message: string) => void;
}

export default function CompanyForm({ open, onClose, onSubmit, initialData, onSuccess }: CompanyFormProps) {
	const { form, setForm } = useFormHandler<Company>(initialData ?? null, {}, onSubmit, open);

	const [loading, setLoading] = useState(false);

	// file chọn tại client (không đụng vào form)
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [bankAttachmentFile, setBankAttachmentFile] = useState<File | null>(null);

	// cờ xoá file đang có trên server
	const [removeAvatar, setRemoveAvatar] = useState(false);
	const [removeBankAttachment, setRemoveBankAttachment] = useState(false);

	// preview
	const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatarUrl ?? initialData?.avatar ?? null);
	const [bankAttachmentName, setBankAttachmentName] = useState<string | null>(null);

	const avatarInputRef = useRef<HTMLInputElement>(null);
	const bankInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!initialData) return;
		setForm(initialData);
		setAvatarFile(null);
		setBankAttachmentFile(null);
		setAvatarPreview(initialData.avatarUrl ?? initialData.avatar ?? null);
		setRemoveAvatar(false);
		setRemoveBankAttachment(false);
		setBankAttachmentName(null);
		if (avatarInputRef.current) avatarInputRef.current.value = '';
		if (bankInputRef.current) bankInputRef.current.value = '';
	}, [initialData]);

	// revoke objectURL khi đổi ảnh
	useEffect(() => {
		let url: string | null = null;
		if (avatarFile) {
			url = URL.createObjectURL(avatarFile);
			setAvatarPreview(url);
		} else {
			// quay về ảnh cũ từ server (nếu có)
			setAvatarPreview(initialData?.avatarUrl ?? initialData?.avatar ?? null);
		}
		return () => {
			if (url) URL.revokeObjectURL(url);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [avatarFile]);

	const handlePickAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null;
		setAvatarFile(file);
		if (file) setRemoveAvatar(false);
	};

	const handleClearAvatar = () => {
		setAvatarFile(null);
		setRemoveAvatar(true);
		if (avatarInputRef.current) avatarInputRef.current.value = '';
	};

	const handlePickBankAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null;
		setBankAttachmentFile(file);
		setBankAttachmentName(file ? file.name : null);
		if (file) setRemoveBankAttachment(false);
	};

	const handleClearBankAttachment = () => {
		setBankAttachmentFile(null);
		setBankAttachmentName(null);
		setRemoveBankAttachment(true);
		if (bankInputRef.current) bankInputRef.current.value = '';
	};

	const toFormData = (data: Partial<Company>) => {
		const fd = new FormData();

		// các field cơ bản
		if (data.name) fd.append('name', data.name);
		if (data.address) fd.append('address', data.address);
		if (data.taxcode) fd.append('taxcode', data.taxcode);

		// companyInfos/config: tuỳ API mong đợi
		if (Array.isArray((data as any).companyInfos)) {
			fd.append('companyInfos', JSON.stringify((data as any).companyInfos));
		}
		if ((data as any).config) {
			fd.append('config', JSON.stringify((data as any).config));
		}

		if (avatarFile) fd.append('avatar', avatarFile);
		if (removeAvatar) fd.append('removeAvatar', 'true');

		if (bankAttachmentFile) fd.append('bankAttachment', bankAttachmentFile);
		if (removeBankAttachment) fd.append('removeBankAttachment', 'true');

		return fd;
	};

	const handleSave = async () => {
		try {
			setLoading(true);
			const fd = toFormData(form);
			const res = await onSubmit(fd);
			onSuccess?.(res.code, res.message);
			if (res.code === 1) onClose();
		} finally {
			setLoading(false);
		}
	};

	return (
		<CommonDialog
			open={open}
			title="Chỉnh sửa thông tin công ty"
			onClose={onClose}
			actions={[
				{ label: 'Đóng', variant: 'outlined', onClick: onClose, sx: { width: '50%' }, disabled: loading },
				{
					label: loading ? 'Saving...' : 'Lưu',
					variant: 'contained',
					onClick: handleSave,
					sx: { width: '50%' },
					disabled: loading
				}
			]}
		>
			<Stack spacing={2} sx={{ mt: 1 }}>
				<TextField
					label="Tên công ty"
					fullWidth
					value={form.name || ''}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
					disabled
				/>
				<TextField
					label="Địa chỉ"
					fullWidth
					value={form.address || ''}
					onChange={(e) => setForm({ ...form, address: e.target.value })}
				/>
				<TextField
					label="Mã số thuế"
					fullWidth
					value={form.taxcode || ''}
					onChange={(e) => setForm({ ...form, taxcode: e.target.value })}
				/>

				<Box>
					<Typography variant="subtitle2" sx={{ mb: 1 }}>
						Ảnh thương hiệu
					</Typography>
					<Stack direction="row" alignItems="center" spacing={2}>
						<Avatar src={avatarPreview ?? undefined} sx={{ width: 64, height: 64 }}>
							{!avatarPreview && (form.name?.[0] ?? 'C')}
						</Avatar>

						<input
							ref={avatarInputRef}
							id="avatar-input"
							type="file"
							accept="image/*"
							onChange={handlePickAvatar}
							style={{ display: 'none' }}
						/>
						<label htmlFor="avatar-input">
							<Button component="span" variant="outlined">
								Chọn ảnh
							</Button>
						</label>
					</Stack>
				</Box>

				<Box>
					<Typography variant="subtitle2" sx={{ mb: 1 }}>
						Thông tin chuyển khoản (PDF/Ảnh)
					</Typography>
					<Stack direction="row" spacing={2} alignItems="center">
						<input
							ref={bankInputRef}
							id="bank-input"
							type="file"
							accept="application/pdf,image/*"
							onChange={handlePickBankAttachment}
							style={{ display: 'none' }}
						/>
						<label htmlFor="bank-input">
							<Button component="span" variant="outlined">
								Chọn tệp
							</Button>
						</label>

						<Typography className="bank-attachment-wrapper" variant="body2" sx={{ maxWidth: 300 }} noWrap>
							{bankAttachmentName ??
								initialData?.bankAttachmentUrl ??
								initialData?.bankAttachment ??
								form.bankAttachment ??
								'Chưa có tệp'}
						</Typography>

						{(initialData?.bankAttachmentUrl || initialData?.bankAttachment) && !bankAttachmentFile && (
							<Button
								href={initialData?.bankAttachmentUrl ?? initialData?.bankAttachment ?? undefined}
								target="_blank"
								rel="noopener"
								variant="text"
							>
								Xem tệp hiện có
							</Button>
						)}
					</Stack>
				</Box>
			</Stack>
		</CommonDialog>
	);
}
