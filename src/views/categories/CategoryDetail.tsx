// src/views/category/CategoryDetail.tsx
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import type { Category } from 'api/categoryService';

type CategoryDetailProps = {
	open: boolean;
	category?: Category | null;
	onClose: () => void;
	onEdit?: (category: Category) => void;
	onDelete?: (id: number) => void;
};

export default function CategoryDetail({ open, category, onClose, onEdit, onDelete }: CategoryDetailProps) {
	const hasData = Boolean(category);

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Category Detail</DialogTitle>

			<DialogContent dividers>
				{hasData ? (
					<div className="category-detail">
						<p>
							<strong>ID:</strong> {category!.id}
						</p>
						<p>
							<strong>Name:</strong> {category!.name}
						</p>
					</div>
				) : (
					<p>No data available</p>
				)}
			</DialogContent>

			<DialogActions>
				{hasData && onEdit && (
					<Button onClick={() => onEdit!(category!)} variant="outlined">
						Edit
					</Button>
				)}
				{hasData && onDelete && (
					<Button color="error" onClick={() => onDelete!(category!.id ?? 0)}>
						Delete
					</Button>
				)}
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
}
