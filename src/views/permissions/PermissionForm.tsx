import { Alert, Snackbar, TextField } from '@mui/material';
import { Permission } from 'api/permissionService';
import CommonDialog from 'components/Dialog/GenericDialog';
import { useFormHandler } from 'hooks/useFormHandler';
import { useEffect, useState } from 'react';

interface PermissionFormProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: Partial<Permission>) => Promise<{ code: number; message?: string }>;
	initialData?: Permission | null;
}

export default function PermissionForm({ open, onClose, onSubmit, initialData }: PermissionFormProps) {
	const { form, setForm, errorMessage, setErrorMessage, successMessage, setSuccessMessage, handleSubmit } = useFormHandler<Permission>(
		initialData ?? null,
		{ name: '', description: '' },
		onSubmit,
		open
	);

	useEffect(() => {
		if (initialData) setForm(initialData);
		else setForm({ name: '', description: '' });
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
						onClick: handleSubmit,
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
			<Snackbar
				open={!!errorMessage}
				autoHideDuration={4000}
				onClose={() => setErrorMessage(null)}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert onClose={() => setErrorMessage(null)} severity="error" variant="filled" sx={{ width: '100%' }}>
					{errorMessage}
				</Alert>
			</Snackbar>

			<Snackbar
				open={!!successMessage}
				autoHideDuration={3000}
				onClose={() => setSuccessMessage(null)}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert onClose={() => setSuccessMessage(null)} severity="success" variant="filled" sx={{ width: '100%' }}>
					{successMessage}
				</Alert>
			</Snackbar>
		</>
	);
}
