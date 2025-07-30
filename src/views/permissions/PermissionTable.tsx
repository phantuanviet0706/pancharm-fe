import { Permission } from 'api/permissionService';
import ActionMenu from 'components/ActionMenu/ActionMenu';

interface PermissionTableProps {
	permissions: Permission[];
	onEdit: (perm: Permission) => void;
	onDelete: (id: number) => void;
}

export default function PermissionTable({ permissions, onEdit, onDelete }: PermissionTableProps) {
	if (!permissions || !permissions.length) {
		return <p>No permission found.</p>
	}
	return (
		<table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
			<thead>
				<tr>
					<th style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>ID</th>
					<th style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Name</th>
					<th style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Description</th>
					<th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Actions</th>
				</tr>
			</thead>
			<tbody>
				{permissions.map((perm) => (
					<tr key={perm.id}>
						<td style={{ padding: '8px' }}>{perm.id}</td>
						<td style={{ padding: '8px' }}>
							<span title="{perm.name}">{perm.name}</span>
						</td>
						<td style={{ padding: '8px' }}>
							<span title="{perm.description}">{perm.description}</span>
						</td>
						<td style={{ padding: '8px' }}>
							<ActionMenu
								actions={[
									{ label: 'Edit', onClick: () => onEdit(perm) },
									{ label: 'Delete', onClick: () => onDelete(perm.id), color: 'red' }
								]}
							/>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
