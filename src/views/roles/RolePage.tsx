import { useMemo, useState } from 'react';
import { Button, Pagination, TextField } from '@mui/material';
import RoleTable from './RoleTable';
import RoleForm from './RoleForm';
import { useRoles } from 'hooks/useRoles';
import { createRole, deleteRole, Role, updateRole } from 'api/roleService';
import GenericSnackbar from 'components/Snackbar/GenericSnackbar';

export default function RolePage() {
	const [page, setPage] = useState(0);
	const [searchText, setSearchText] = useState('');

	const query = useMemo(() => ({ page, limit: 50, keyword: searchText }), [page, searchText]);

	const { roles, loading, error, setRoles, total, totalPages } = useRoles(query);
	const [formOpen, setFormOpen] = useState(false);
	const [editData, setEditData] = useState<Role | null>(null);

	const [snackbarCode, setSnackbarCode] = useState<number>(0);
	const [snackbarMessage, setSnackbarMessage] = useState<string>('');

	const handleFormSuccess = (code: number, message: string) => {
		setSnackbarCode(code);
		setSnackbarMessage(message);
	};

	const handleCreate = async (data: Partial<Role>) => {
		try {
			const res = await createRole(data as Omit<Role, 'id'>);
			if (res?.code === 1 && res?.result) {
				setRoles([...roles, res.result]);
			}
			return { code: res?.code, message: res?.message };
		} catch (err: any) {
			return {
				code: -1,
				message: err?.response?.data?.message || err.message || 'Create failed'
			};
		}
	};

	const handleUpdate = async (data: Partial<Role>) => {
		if (!data.id) return { code: -1, message: 'Missing ID for update' };
		try {
			const res = await updateRole(data, data.id);
			if (res?.code === 1 && res?.result) {
				setRoles(roles.map((p) => (p.id === res.result.id ? res.result : p)));
			}
			return { code: res?.code, message: res?.message };
		} catch (err: any) {
			return {
				code: -1,
				message: err?.response?.data?.message || err.message || 'Update failed'
			};
		}
	};

	const handleDelete = async (id: number) => {
		try {
			const res = await deleteRole(id);
			if (res?.code === 1) {
				setRoles(roles.filter((p) => p.id !== id));
			}
			return { code: res?.code, message: res?.message };
		} catch (err: any) {
			return {
				code: -1,
				message: err?.response?.data?.message || err.message || 'Delete failed'
			};
		}
	};

	if (loading) return <p>Loading ...</p>;
	if (error) return <p>Failed to load roles</p>;

	return (
		<div style={{ position: 'relative' }}>
			<h1>Roles</h1>
			<div className="side-btn">
				<TextField
					className="search-box-wrapper"
					label="Search"
					variant="outlined"
					size="small"
					fullWidth
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							setSearchText((e.target as HTMLInputElement).value);
							setPage(0);
						}
					}}
				/>
				<Button
					className="btn-create-wrapper"
					variant="contained"
					onClick={() => {
						setEditData(null);
						setFormOpen(true);
					}}
				>
					+ Create Role
				</Button>
			</div>
			<RoleTable
				roles={roles}
				onEdit={(perm) => {
					setEditData(perm);
					setFormOpen(true);
				}}
				onDelete={handleDelete}
			/>
			<RoleForm
				open={formOpen}
				onClose={() => setFormOpen(false)}
				onSubmit={(data) => (editData ? handleUpdate({ ...editData, ...data }) : handleCreate(data))}
				initialData={editData}
				onSuccess={handleFormSuccess}
			/>
			<div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
				<Pagination count={totalPages} page={page + 1} onChange={(e, value) => setPage(value - 1)} color="primary" />
			</div>

			<GenericSnackbar
				code={snackbarCode}
				message={snackbarMessage}
				onClose={() => {
					setSnackbarCode(0);
					setSnackbarMessage('');
				}}
			/>
		</div>
	);
}
