import { Button, TextField } from '@mui/material';
import { createUser, deleteUser, getUser, updateUser, User } from 'api/userService';
import { useUsers } from 'hooks/useUsers';
import { useMemo, useState } from 'react';
import UserTable from './UserTable';
import UserForm, { ActionType } from './UserForm';
import GenericSnackbar from 'components/Snackbar/GenericSnackbar';

export default function UserPage() {
	const [page, setPage] = useState(0);
	const [searchText, setSearchText] = useState('');

	const query = useMemo(() => ({ page, limit: 50, keyword: searchText }), [page, searchText]);

	const { users, loading, error, setUsers, total, totalPages } = useUsers(query);

	const [formOpen, setFormOpen] = useState(false);
	const [editData, setEditData] = useState<User | null>(null);

	const [detailData, setDetailData] = useState<User | null>(null);
	const [detailOpen, setDetailOpen] = useState(false);

	const [snackbarCode, setSnackbarCode] = useState<number>(0);
	const [snackbarMessage, setSnackbarMessage] = useState<string>('');

	const [action, setAction] = useState<ActionType>('create');

	const handleFormSuccess = (code: number, message: string) => {
		setSnackbarCode(code);
		setSnackbarMessage(message);
	};

	const handleCreate = async (data: Partial<User>) => {
		try {
			const res = await createUser(data as Omit<User, 'id'>);
			if (res?.code === 1 && res?.result) {
				setUsers([...users, res.result]);
			}
			return { code: res?.code, message: res?.message };
		} catch (err: any) {
			return {
				code: -1,
				message: err?.response?.data?.message || err.message
			};
		}
	};

	const handleUpdate = async (data: Partial<User>) => {
		if (!data.id) return { code: -1, message: 'Missing ID for update' };
		try {
			const res = await updateUser(data.id, data);
			if (res?.code === 1 && res?.result) {
				setUsers(users.map((p) => (p.id === res.result.id ? res.result.id : p)));
			}
			return { code: res?.code, message: res?.message };
		} catch (err: any) {
			return {
				code: -1,
				message: err?.response?.data?.message || err.message
			};
		}
	};

	const handleDelete = async (id: number) => {
		try {
			const res = await deleteUser(id);
			if (res?.code === 1) {
				setUsers(users.filter((p) => p.id !== id));
			}
			return { code: res?.code, message: res?.message };
		} catch (err: any) {
			return {
				code: -1,
				message: err?.response?.data?.message || err.message
			};
		}
	};

	const handleDetail = async (id: number) => {
		if (!id) return { code: -1, message: 'Missing ID to get detail' };
		try {
			const res = await getUser(id);
			if (res?.code === 1 && res?.result) {
				setDetailData(res.result);
				setDetailOpen(true);
			}
			return { code: res?.code, message: res?.message };
		} catch (err: any) {
			return {
				code: -1,
				message: err?.response?.data?.message || err.message
			};
		}
	};

	if (loading) return <p>Loading ...</p>;
	if (error) return <p>Failed to load users</p>;

	const onSubmitFunc = (data: Partial<User>) => {
		return editData ? handleUpdate({ ...editData, ...data }) : handleCreate(data);
	};

	const openCreate = () => {
		setEditData(null);
		setAction('create');
		setFormOpen(true);
	};

	const openEdit = (row: User) => {
		setEditData(row);
		setAction('update');
		setFormOpen(true);
	};

	const closeForm = () => {
		setFormOpen(false);
		setEditData(null);
		setAction('create');
	};

	return (
		<div style={{ position: 'relative' }}>
			<h1>Users</h1>
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
				<Button className="btn-create-wrapper" variant="contained" onClick={openCreate}>
					+ Create user
				</Button>
			</div>
			<UserTable users={users} onEdit={openEdit} onDelete={handleDelete} onDetail={handleDetail} />
			<UserForm
				open={formOpen}
				onSubmit={onSubmitFunc}
				onClose={closeForm}
				initialData={editData}
				onSuccess={handleFormSuccess}
				action={action}
			/>

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
