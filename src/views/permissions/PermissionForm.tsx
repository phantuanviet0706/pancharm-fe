import { Alert, Snackbar, TextField } from '@mui/material';
import { DEFAULT_PERMISSION, Permission } from 'api/permissionService';
import CommonDialog from 'components/Dialog/GenericDialog';
import { useFormHandler } from 'hooks/useFormHandler';
import { useEffect, useState } from 'react';

interface PermissionFormProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: Partial<Permission>) => Promise<{ code: number; message?: string }>;
	initialData?: Permission | null;
	onSuccess?: (code: number, message: string) => void;
}

export default function PermissionForm({ open, onClose, onSubmit, initialData, onSuccess }: PermissionFormProps) {
	const { form, setForm, handleSubmit } = useFormHandler<Permission>(initialData ?? null, DEFAULT_PERMISSION, onSubmit, open);

	useEffect(() => {
		if (initialData) setForm(initialData);
		else setForm(DEFAULT_PERMISSION);
	}, [initialData]);

	return (
		<>
			<CommonDialog
				open={open}
				title={initialData ? 'Edit Permission' : 'Create Permission'}
				onClose={onClose}
				actions={[
					{
						label: 'Close',
						variant: 'outlined',
						color: 'secondary',
						onClick: onClose,
						sx: { width: '50%' }
					},
					{
						label: 'Save',
						variant: 'contained',
						color: 'primary',
						onClick: () =>
							handleSubmit((res) => {
								onSuccess?.(res.code, res.message || '');
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
				/>
				<TextField
					label="Description"
					fullWidth
					multiline
					rows={4}
					sx={{ mt: 2 }}
					value={form.description || ''}
					onChange={(e) => setForm({ ...form, description: e.target.value })}
				/>
			</CommonDialog>
		</>
	);
}
