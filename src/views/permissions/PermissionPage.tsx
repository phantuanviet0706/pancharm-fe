import { useMemo, useState } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { createPermission, updatePermission, deletePermission, Permission } from '../../api/permissionService';
import { Button, Pagination, TextField } from '@mui/material';
import PermissionTable from './PermissionTable';
import PermissionForm from './PermissionForm';

export default function PermissionPage() {
	const [page, setPage] = useState(0);
	const [searchText, setSearchText] = useState('');

	const query = useMemo(() => ({ page, limit: 50, keyword: searchText }), [page, searchText]);

	const { permissions, loading, error, setPermissions, total, totalPages } = usePermissions(query);
	const [formOpen, setFormOpen] = useState(false);
	const [editData, setEditData] = useState<Permission | null>(null);

	const handleCreate = async (data: Partial<Permission>) => {
		try {
			const res = await createPermission(data as Omit<Permission, 'id'>);
			if (res?.code === 1 && res?.result) {
				setPermissions([...permissions, res.result]);
			}
			return { code: res?.code, message: res?.message };
		} catch (err: any) {
			return {
				code: -1,
				message: err?.response?.data?.message || err.message || 'Create failed'
			};
		}
	};

	const handleUpdate = async (data: Partial<Permission>) => {
		if (!data.id) return { code: -1, message: 'Missing ID for update' };
		try {
			const res = await updatePermission(data.id, data);
			if (res?.code === 1 && res?.result) {
				setPermissions(permissions.map((p) => (p.id === res.result.id ? res.result : p)));
			}
		} catch (err: any) {
			return {
				code: -1,
				message: err?.response?.data?.message || err.message || 'Update failed'
			};
		}
	};

	const handleDelete = async (id: number) => {
		try {
			const res = await deletePermission(id);
			if (res?.code === 1) {
				setPermissions(permissions.filter((p) => p.id != id));
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
	if (error) return <p>Failed to load permissions</p>;

	return (
		<div style={{ position: 'relative' }}>
			<h1>Permissions</h1>
			<div className="side-btn">
				<TextField
					className="search-box-wrapper"
					label="Search"
					variant="outlined"
					size="small"
					fullWidth
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							console.log((e.target as HTMLInputElement).value);
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
					+ Create Permission
				</Button>
			</div>
			<PermissionTable
				permissions={permissions}
				onEdit={(perm) => {
					setEditData(perm);
					setFormOpen(true);
				}}
				onDelete={handleDelete}
			/>
			<PermissionForm
				open={formOpen}
				onClose={() => setFormOpen(false)}
				onSubmit={(data) => (editData ? handleUpdate({ ...editData, ...data }) : handleCreate(data))}
				initialData={editData}
			/>
			<div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
				<Pagination count={totalPages} page={page + 1} onChange={(e, value) => setPage(value - 1)} color="primary" />
			</div>
		</div>
	);
}
