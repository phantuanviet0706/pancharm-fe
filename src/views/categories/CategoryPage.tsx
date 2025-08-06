import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Pagination, TextField } from '@mui/material';
import { Category, createCategory, deleteCategory, updateCategory } from 'api/categoryService';
import { useCategories } from 'hooks/useCategories';
import { useMemo, useState } from 'react';
import CategoryTable from './CategoryTable';
import CategoryForm from './CategoryForm';
import GenericSnackbar from 'components/Snackbar/GenericSnackbar';

export default function CategoryPage() {
	const [page, setPage] = useState(0);
	const [searchText, setSearchText] = useState('');

	const query = useMemo(() => ({ page, limit: 50, keyword: searchText }), [page, searchText]);

	const { categories, loading, error, setCategories, total, totalPages } = useCategories(query);

	const [formOpen, setFormOpen] = useState(false);
	const [editData, setEditData] = useState<Category | null>(null);

	const [detailData, setDetailData] = useState<Category | null>(null);
	const [detailOpen, setDetailOpen] = useState(false);

	const [snackbarCode, setSnackbarCode] = useState<number>(0);
	const [snackbarMessage, setSnackbarMessage] = useState<string>('');

	const handleFormSuccess = (code: number, message: string) => {
		setSnackbarCode(code);
		setSnackbarMessage(message);
	};

	const handleCreate = async (data: Partial<Category>) => {
		try {
			const res = await createCategory(data as Omit<Category, 'id'>);
			if (res?.code === 1 && res?.result) {
				setCategories([...categories, res.result]);
			}
			return { code: res?.code, message: res?.message };
		} catch (err: any) {
			return {
				code: -1,
				message: err?.response?.data?.message || err.message
			};
		}
	};

	const handleUpdate = async (data: Partial<Category>) => {
		if (!data.id) return { code: -1, message: 'Missing ID for update' };
		try {
			const res = await updateCategory(data.id, data);
			if (res?.code === 1 && res?.result) {
				setCategories(categories.map((p) => (p.id === res.result.id ? res.result : p)));
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
			const res = await deleteCategory(id);
			if (res?.code === 1) {
				setCategories(categories.filter((p) => p.id !== id));
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
		const cat = categories.find((c) => c.id === id);
		if (cat) {
			setDetailData(cat);
			setDetailOpen(true);
		}
	};

	if (loading) return <p>Loading ...</p>;
	if (error) return <p>Failed to load categories</p>;

	return (
		<div style={{ position: 'relative' }}>
			<h1>Categories</h1>
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
					+ Create category
				</Button>
			</div>
			<CategoryTable
				categories={categories}
				onEdit={(perm) => {
					setEditData(perm);
					setFormOpen(true);
				}}
				onDelete={handleDelete}
				onDetail={handleDetail}
			/>
			<CategoryForm
				open={formOpen}
				onClose={() => setFormOpen(false)}
				onSubmit={(data) => (editData ? handleUpdate({ ...editData, ...data }) : handleCreate(data))}
				initialData={editData}
				onSuccess={handleFormSuccess}
			/>
			<div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
				<Pagination count={totalPages} page={page + 1} onChange={(e, value) => setPage(value - 1)} color="primary" />
			</div>

			<Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
				<DialogTitle>Category Detail</DialogTitle>
				<DialogContent dividers>
					{detailData ? (
						<>
							<p>
								<strong>ID:</strong> {detailData.id}
							</p>
							<p>
								<strong>Name:</strong> {detailData.name}
							</p>
						</>
					) : (
						<p>No data available</p>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDetailOpen(false)}>Close</Button>
				</DialogActions>
			</Dialog>

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
