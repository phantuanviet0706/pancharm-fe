import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { createProduct, deleteProduct, Product, updateProduct } from 'api/productService';
import { useProducts } from 'hooks/useProducts';
import { useMemo, useState } from 'react';
import ProductTable from './ProductTable';
import GenericSnackbar from 'components/Snackbar/GenericSnackbar';
import ProductForm from './ProductForm';

export default function ProductPage() {
	const [page, setPage] = useState(0);
	const [searchText, setSearchText] = useState('');

	const query = useMemo(() => ({ page, limit: 50, keyword: searchText }), [page, searchText]);

	const { products, loading, error, setProducts, total, totalPages } = useProducts(query);

	const [formOpen, setFormOpen] = useState(false);
	const [editData, setEditData] = useState<Product | null>(null);

	const [detailData, setDetailData] = useState<Product | null>(null);
	const [detailOpen, setDetailOpen] = useState(false);

	const [snackbarCode, setSnackbarCode] = useState<number>(0);
	const [snackbarMessage, setSnackbarMessage] = useState<string>('');

	const handleFormSuccess = (code: number, message: string) => {
		setSnackbarCode(code);
		setSnackbarMessage(message);
	};

	const handleCreate = async (data: Partial<Product>) => {
		try {
			const res = await createProduct(data as Omit<Product, 'id'>);
			if (res?.code === 1 && res?.result) {
				setProducts([...products, res.result]);
			}
			return { code: res?.code, message: res?.message };
		} catch (err: any) {
			return {
				code: -1,
				message: err?.response?.data?.message || err.message
			};
		}
	};

	const handleUpdate = async (data: Partial<Product>) => {
		if (!data.id) return { code: -1, message: 'Missing ID for update' };
		try {
			const res = await updateProduct(data.id, data);
			if (res?.code === 1 && res?.result) {
				setProducts(products.map((p) => (p.id === res.result.id ? res.result : p)));
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
			const res = await deleteProduct(id);
			if (res?.code === 1) {
				setProducts(products.filter((p) => p.id !== id));
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
		const prod = products.find((c) => c.id === id);
		if (prod) {
			setDetailData(prod);
			setDetailOpen(true);
		}
	};

	if (loading) return <p>Loading ...</p>;
	if (error) return <p>Failed to load products</p>;

	return (
		<div style={{ position: 'relative' }}>
			<h1>Products</h1>
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
					+ Create product
				</Button>
			</div>
			<ProductTable
				products={products}
				onEdit={(perm) => {
					setEditData(perm);
					setFormOpen(true);
				}}
				onDelete={handleDelete}
				onDetail={handleDetail}
			/>
			<ProductForm
				open={formOpen}
				onClose={() => setFormOpen(false)}
				onSubmit={(data) => (editData ? handleUpdate({ ...editData, ...data }) : handleCreate(data))}
				initialData={editData}
				onSuccess={handleFormSuccess}
			/>
			<Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
				<DialogTitle>Product Detail</DialogTitle>
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
