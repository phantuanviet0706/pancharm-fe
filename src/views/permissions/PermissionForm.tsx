import { Box, Button, Dialog, DialogContent, DialogTitle, Modal, TextField } from '@mui/material';
import { Permission } from 'api/permissionService';
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
		<Modal open={open} onClose={onClose}>
			{/* <Box sx={{ p: 3, background: '#fff', width: 400, margin: '10% auto', borderRadius: 2 }}>
				<h3>{initialData ? 'Edit Permission' : 'Create Permission'}</h3>
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
				<Button
					className="btn-close-form"
					variant="contained"
					sx={{
						backgroundColor: '#6c757d',
						color: '#fff',
						'&:hover': {
							backgroundColor: '#5c636a'
						},
						margin: '5px',
						width: '50%'
					}}
					onClick={onClose}
				>
					Close
				</Button>
				<Button
					className="btn-save-from"
					variant="contained"
					sx={{
						backgroundColor: '#1976d2',
						color: '#fff',
						'&:hover': {
							backgroundColor: '#1565c0'
						},
						margin: '5px',
						width: '50%'
					}}
					onClick={handleSubmit}
				>
					Save
				</Button>
			</Box> */}
			<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll="body">
				<DialogTitle>{initialData ? 'Edit Permission' : 'Create Permission'}</DialogTitle>
				<DialogContent>
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
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
						<Button variant="contained" sx={{ backgroundColor: '#6c757d', width: '50%' }} onClick={onClose}>
							Close
						</Button>
						<Button variant="contained" sx={{ backgroundColor: '#1976d2', width: '50%' }} onClick={handleSubmit}>
							Save
						</Button>
					</Box>
				</DialogContent>
			</Dialog>
		</Modal>
	);
}
