import { Alert, Autocomplete, Snackbar, TextField } from '@mui/material';
import { fetchData, Permission, PermissionQuery } from 'api/permissionService';
import { Role } from 'api/roleService';
import CommonDialog from 'components/Dialog/GenericDialog';
import { useEffect, useState } from 'react';

interface RoleFormProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: Partial<Role>) => Promise<{ code: number; message?: string } | undefined>;
	initialData?: Role | null;
}

export default function RoleForm({ open, onClose, onSubmit, initialData }: RoleFormProps) {
	const [form, setForm] = useState<Partial<Role>>({ name: '', description: '', permissions: [] });
	const [permissionOptions, setPermissionOptions] = useState<Permission[]>([]);
	const [loading, setLoading] = useState(false);
	const [autocompleteOpen, setAutocompleteOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handlePermissionSearch = async (query: PermissionQuery) => {
		try {
			setLoading(true);
			const res = await fetchData(query);
			let permissionOpts = res && res.result ? res.result.content : [];
			setPermissionOptions(permissionOpts);
		} catch (err) {
			console.error('Failed to fetch permissions:', err);
			setPermissionOptions([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (initialData) {
			setForm(initialData);
		} else setForm({ name: '', description: '', permissions: [] });
	}, [initialData]);

	const handleSubmit = async () => {
		try {
			const formToSubmit = {
				...form,
				permissions: (form.permissions || []).map((p: any) => p.name)
			};

			const res = await Promise.resolve(onSubmit(formToSubmit));

			if (res?.code !== 1) {
				setErrorMessage(res?.message || 'Something went wrong');
				return;
			}

			setSuccessMessage(res?.message || 'Action successful');
			onClose();
		} catch (error: any) {
			const message = error?.response?.data?.message || error?.message || 'Something went wrong';
			setErrorMessage(message);
		}
	};

	return (
		<>
			<CommonDialog
				open={open}
				title={initialData ? 'Edit Role' : 'Create Role'}
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
				<Autocomplete
					open={autocompleteOpen}
					onOpen={() => {
						setAutocompleteOpen(true);
						if (permissionOptions.length === 0) {
							handlePermissionSearch({});
						}
					}}
					onClose={() => setAutocompleteOpen(false)}
					multiple
					options={permissionOptions || []}
					getOptionLabel={(option) => option.name}
					filterSelectedOptions
					value={form.permissions || []}
					isOptionEqualToValue={(option, value) => option.id === value.id}
					onChange={(_, newValue) => {
						setForm({ ...form, permissions: newValue });
					}}
					onInputChange={(_, value) => handlePermissionSearch({ keyword: value })}
					loading={loading}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Permissions"
							placeholder="Search permissions"
							sx={{ mt: 2 }}
							slotProps={{
								inputLabel: {
									shrink: true
								}
							}}
						/>
					)}
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
