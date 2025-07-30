import { useMemo, useState } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { createPermission, updatePermission, deletePermission, Permission } from '../../api/permissionService';
import { Button } from '@mui/material';
import PermissionTable from './PermissionTable';
import PermissionForm from './PermissionForm';

export default function PermissionPage() {
	const [page, setPage] = useState(0);
	const query = useMemo(() => ({page, limit: 50}), [page]);

	const { permissions, loading, error, setPermissions } = usePermissions(query);
	const [formOpen, setFormOpen] = useState(false);
	const [editData, setEditData] = useState<Permission | null>(null);

	const handleCreate = async (data: Partial<Permission>) => {
		const res = await createPermission(data as Omit<Permission, 'id'>);
		setPermissions([...permissions, res]);
	};

	const handleUpdate = async (data: Partial<Permission>) => {
		if (!data.id) return;
		const res = await updatePermission(data.id, data);
		setPermissions(permissions.map((p) => (p.id === data.id ? res : p)));
	};

	const handleDelete = async (id: number) => {
		await deletePermission(id);
		setPermissions(permissions.filter((p) => p.id != id));
	};

	if (loading) return <p>Loading ...</p>;
	if (error) return <p>Failed to load permissions</p>;

	return (
		<div style={{ padding: '16px' }}>
			<h1>Permissions</h1>
			<Button
				variant="contained"
				onClick={() => {
					setEditData(null);
					setFormOpen(true);
				}}
			>
				+ Create Permission
			</Button>
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
		</div>
	);
}
