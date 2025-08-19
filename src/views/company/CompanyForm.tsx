import { TextField } from '@mui/material';
import { Company } from 'api/companyService';
import CommonDialog from 'components/Dialog/GenericDialog';
import { useFormHandler } from 'hooks/useFormHandler';
import { useEffect, useState } from 'react';

interface CompanyFormProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: Partial<Company>) => Promise<{ code: number; message: string }>;
	initialData?: Company | null;
	onSuccess?: (code: number, message: string) => void;
}

export default function CompanyForm({ open, onClose, onSubmit, initialData, onSuccess }: CompanyFormProps) {
	const { form, setForm, handleSubmit } = useFormHandler<Company>(initialData ?? null, {}, onSubmit, open);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!initialData) {
			return;
		}

		setForm(initialData);
	}, [initialData]);

	return (
		<>
			<CommonDialog
				open={open}
				title="Edit Category"
				onClose={onClose}
				actions={[
					{
						label: 'Close',
						variant: 'outlined',
						onClick: onClose,
						sx: { width: '50%' }
					},
					{
						label: 'Save',
						variant: 'contained',
						onClick: () =>
							handleSubmit((res) => {
								onSuccess?.(res.code, res.message);
								if (res.code === 1) onClose();
							}),
						sx: { width: '50%' }
					}
				]}
			>
				<TextField
					label="Name"
					fullWidth
					sx={{ mt: 2 }}
					value={form.name || ''}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
					disabled
				/>
			</CommonDialog>
		</>
	);
}
