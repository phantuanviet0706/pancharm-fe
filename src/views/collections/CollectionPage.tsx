import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Collection, createCollection, deleteCollection, updateCollection } from 'api/collectionService';
import { useCollections } from 'hooks/useCollections';
import { useMemo, useState } from 'react';
import CollectionTable from './CollectionTable';
import CollectionForm from './CollectionForm';
import GenericSnackbar from 'components/Snackbar/GenericSnackbar';

export default function CollectionPage() {
	const [page, setPage] = useState(0);
	const [searchText, setSearchText] = useState('');

	const query = useMemo(() => ({ page, limit: 50, keyword: searchText }), [page, searchText]);

	const { collections, loading, error, setCollections, total, totalPages } = useCollections(query);

	const [formOpen, setFormOpen] = useState(false);
	const [editData, setEditData] = useState<Collection | null>(null);

	const [detailData, setDetailData] = useState<Collection | null>(null);
	const [detailOpen, setDetailOpen] = useState(false);

	const [snackbarCode, setSnackbarCode] = useState<number>(0);
	const [snackbarMessage, setSnackbarMessage] = useState<string>('');

	const handleFormSuccess = (code: number, message: string) => {
		setSnackbarCode(code);
		setSnackbarMessage(message);
	};

	const handleCreate = async (data: Partial<Collection>) => {
		try {
			const res = await createCollection(data as Omit<Collection, 'id'>);
			if (res?.code === 1 && res?.result) {
				setCollections([...collections, res.result]);
			}
			return {
				code: res?.code,
				message: res?.message
			};
		} catch (err: any) {
			return {
				code: -1,
				message: err?.response?.data?.message || err.message
			};
		}
	};

	const handleUpdate = async (data: Partial<Collection>) => {
		if (!data.id) return { code: -1, message: 'Missing ID for update' };
		try {
			const res = await updateCollection(data.id, data);
			if (res?.code === 1 && res?.result) {
				setCollections(collections.map((p) => (p.id === res.result ? res.result : p)));
			}
			return {
				code: res?.code,
				message: res?.message
			};
		} catch (err: any) {
			return {
				code: -1,
				message: err?.response?.data?.message || err.message
			};
		}
	};

	const handleDelete = async (id: number) => {
		try {
			const res = await deleteCollection(id);
			if (res?.code === 1) {
				return window.location.reload();
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
		const collection = collections.find((c) => c.id === id);
		if (collection) {
			setDetailData(collection);
			setDetailOpen(true);
		}
	};

	if (loading) return <p>Đang tải ...</p>;
	if (error) return <p>Có lỗi khi tải bộ sưu tập</p>;

	return (
		<div style={{ position: 'relative' }}>
			<h1>Bộ sưu tập</h1>
			<div className="side-btn">
				<TextField
					className="search-box-wrapper"
					label="Tìm kiếm"
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
					+ Tạo bộ sưu tập
				</Button>
			</div>
			<CollectionTable
				collections={collections}
				onEdit={(perm) => {
					setEditData(perm);
					setFormOpen(true);
				}}
				onDelete={handleDelete}
				onDetail={handleDetail}
			/>
			<CollectionForm
				open={formOpen}
				onClose={() => setFormOpen(false)}
				onSubmit={(data) => (editData ? handleUpdate({ ...editData, ...data }) : handleCreate(data))}
				initialData={editData}
				onSuccess={handleFormSuccess}
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
