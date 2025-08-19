import { User } from 'api/userService';
import ActionMenu from 'components/ActionMenu/ActionMenu';
import GenericTable from 'components/Table/GenericTable';

import defaultAvatar from 'assets/images/user/default-avatar.jpg';

interface UserProps {
	users: User[] | [];
	onEdit: (perm: User) => void;
	onDelete: (id: number) => void;
	onDetail: (id: number) => void;
}

export default function UserTable({ users, onEdit, onDelete, onDetail }: UserProps) {
	if (!users || !users.length) return <p>No user found.</p>;

	return (
		<GenericTable
			data={users}
			rowKey={(row) => (row?.id ? row.id : 0)}
			columns={[
				{
					key: 'avatar',
					label: 'Avatar',
					render: (row) => {
						return <img className="user-avatar" src={row?.avatar ? row.avatar : defaultAvatar} alt={defaultAvatar}></img>;
					},
					width: '5rem'
				},
				{ key: 'username', label: 'Username' },
				{ key: 'email', label: 'Email' },
				{ key: 'fullname', label: 'Fullname' },
				{ key: 'address', label: 'Address' },
				{ key: 'phone', label: 'Phone' },
				{ key: 'status', label: 'Status' },
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
		></GenericTable>
	);
}
