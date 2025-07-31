import { Permission } from 'api/permissionService';
import ActionMenu from 'components/ActionMenu/ActionMenu';
import GenericTable from 'components/Table/GenericTable';

interface PermissionTableProps {
	permissions: Permission[];
	onEdit: (perm: Permission) => void;
	onDelete: (id: number) => void;
}

export default function PermissionTable({ permissions, onEdit, onDelete }: PermissionTableProps) {
	if (!permissions || !permissions.length) {
		return <p>No permission found.</p>;
	}

	return (
		<GenericTable
			data={permissions}
			rowKey={(row) => row.id}
			columns={[
				{ key: 'id', label: 'ID', width: '10vw' },
				{ key: 'name', label: 'Name' },
				{ key: 'description', label: 'Description' },
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
								{ label: 'Delete', onClick: () => onDelete(row) }
							]}
						/>
					)
				}
			]}
		/>
	);
}
