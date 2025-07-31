import { Box, Button, Dialog, DialogContent, DialogTitle, Modal, TextField } from '@mui/material';
import { Permission } from 'api/permissionService';
import CommonDialog from 'components/Dialog/GenericDialog';
import { useEffect, useState } from 'react';

interface PermissionFormProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: Partial<Permission>) => void;
	initialData?: Permission | null;
}

export default function PermissionForm({ open, onClose, onSubmit, initialData }: PermissionFormProps) {
	const [form, setForm] = useState<Partial<Permission>>({ name: '', description: '' });

	useEffect(() => {
		if (initialData) setForm(initialData);
		else setForm({ name: '', description: '' });
	}, [initialData]);

	const handleSubmit = () => {
		onSubmit(form);
		onClose();
	};

	return (
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
	);
}
