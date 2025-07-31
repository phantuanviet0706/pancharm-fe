import { useMemo, useState } from 'react';
import { Button, Pagination, TextField } from '@mui/material';
import RoleTable from './RoleTable';
import RoleForm from './RoleForm';
import { useRoles } from 'hooks/useRoles';
import { createRole, deleteRole, Role, updateRole } from 'api/roleService';

export default function RolePage() {
	const [page, setPage] = useState(0);
	const [searchText, setSearchText] = useState('');

	const query = useMemo(() => ({ page, limit: 50, keyword: searchText }), [page, searchText]);

	const { roles, loading, error, setRoles, total, totalPages } = useRoles(query);
	const [formOpen, setFormOpen] = useState(false);
	const [editData, setEditData] = useState<Role | null>(null);

	const handleCreate = async (data: Partial<Role>) => {
		const res = await createRole(data as Omit<Role, 'id'>);
		const mock_result = res && res.result ? res.result : null;
		setRoles([...roles, mock_result]);
	};

	const handleUpdate = async (data: Partial<Role>) => {
		if (!data.id) return;
		const res = await updateRole(data.id, data);
		const mock_result = res && res.result ? res.result : null;
		setRoles(roles.map((p) => (p.id === mock_result.id ? mock_result : p)));
	};

	const handleDelete = async (id: number) => {
		await deleteRole(id);
		setRoles(roles.filter((p) => p.id != id));
	};

	if (loading) return <p>Loading ...</p>;
	if (error) return <p>Failed to load roles</p>;

	return (
		<div style={{ padding: '16px', position: 'relative' }}>
			<h1>Roles</h1>
			<div className='side-btn'>
				<TextField
					className='search-box-wrapper'
					label="Search"
					variant="outlined"
					size="small"
					fullWidth
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							console.log((e.target as HTMLInputElement).value)
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
			/>
			<div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
				<Pagination count={totalPages} page={page + 1} onChange={(e, value) => setPage(value - 1)} color="primary" />
			</div>
		</div>
	);
}
