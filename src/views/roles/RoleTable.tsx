import { Chip } from '@mui/material';
import { Role } from 'api/roleService';
import ActionMenu from 'components/ActionMenu/ActionMenu';
import GenericTable from 'components/Table/GenericTable';

interface RoleTableProps {
	roles: Role[];
	onEdit: (perm: Role) => void;
	onDelete: (id: number) => void;
}

export default function RoleTable({ roles, onEdit, onDelete }: RoleTableProps) {
	if (!roles || !roles.length) {
		return <p>No role found.</p>;
	}

	return (
		<GenericTable
			data={roles}
			rowKey={(row) => (row?.id ? row.id : 0)}
			columns={[
				{ key: 'id', label: 'ID', width: '10vw' },
				{ key: 'name', label: 'Name' },
				{ key: 'description', label: 'Description', className: 'text-limit' },
				{
					key: 'permissions',
					label: 'Permissions',
					render: (row) => (
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
							{(row.permissions as string[])?.map((perm, idx) => (
								<Chip key={idx} label={perm} size="small" color="primary" variant="outlined" />
							))}
						</div>
					)
				},
				{
					key: 'actions',
					label: 'Actions',
					align: 'right',
					width: '100px',
					headerStyle: { marginRight: '10px' },
					render: (row) => (
						<ActionMenu
							actions={[
								{ label: 'Edit', onClick: () => onEdit(row) },
								{ label: 'Delete', onClick: () => onDelete(row?.id ? row.id : 0), color: 'red' }
							]}
						/>
					)
				}
			]}
		/>
	);
}
