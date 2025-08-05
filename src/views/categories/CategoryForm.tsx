import { Alert, Autocomplete, Snackbar, TextField } from '@mui/material';
import { Category, CategoryQuery, fetchData } from 'api/categoryService';
import CommonDialog from 'components/Dialog/GenericDialog';
import { useFormHandler } from 'hooks/useFormHandler';
import { useEffect, useState } from 'react';

interface CategoryFormProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: Partial<Category>) => Promise<{ code: number; message: string }>;
	initialData?: Category | null;
}

export default function CategoryForm({ open, onClose, onSubmit, initialData }: CategoryFormProps) {
	const { form, setForm, errorMessage, setErrorMessage, successMessage, setSuccessMessage, handleSubmit } = useFormHandler<Category>(
		initialData ?? null,
		{ name: '', slug: '', parentCategoryId: 0 },
		onSubmit,
		open,
		(form: Partial<Category>) => ({
			...form,
			categories: Array.isArray(form.categories) ? form.categories.map((p: any) => p.id) : []
		})
	);

	const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [autocompleteOpen, setAutocompleteOpen] = useState(false);

	const handleCategorySearch = async (query: CategoryQuery) => {
		try {
			setLoading(true);
			const res = await fetchData(query);
			let categoryOpts = res && res.result ? res.result.content : [];
			setCategoryOptions(categoryOpts);
		} catch (err) {
			console.error('Failed to fetch categories:', err);
			setCategoryOptions([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (initialData) {
			setForm(initialData);
		} else {
			setForm({ name: '', slug: '', parentCategoryId: 0 });
		}
	}, [initialData]);

	return (
		<>
			<CommonDialog
				open={open}
				title={initialData ? 'Edit Category' : 'Create Category'}
				onClose={onClose}
				actions={[
					{
						label: 'Close',
						variant: 'outlined',
						onClick: onClose,
						sx: { width: '50%' }
					},
					{
						label: 'Save',
						variant: 'contained',
						onClick: () => handleSubmit(() => onClose()),
						sx: { width: '50%' }
					}
				]}
			>
				<TextField
					label="Name *"
					fullWidth
					sx={{ mt: 2 }}
					value={form.name || ''}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
				/>

				<TextField
					label="Slug"
					fullWidth
					sx={{ mt: 2 }}
					value={form.slug || ''}
					onChange={(e) => setForm({ ...form, slug: e.target.value })}
				/>

				<Autocomplete
					open={autocompleteOpen}
					onOpen={() => {
						setAutocompleteOpen(true);
						if (categoryOptions.length === 0) {
							handleCategorySearch({});
						}
					}}
					onClose={() => setAutocompleteOpen(false)}
					options={categoryOptions || []}
					getOptionLabel={(option) => option.name}
					filterSelectedOptions
					value={form.categories || []}
					isOptionEqualToValue={(option, value) => option.id === value.id}
					onChange={(_, newValue) => {
						setForm({ ...form, categories: newValue });
					}}
					onInputChange={(_, value) => handleCategorySearch({ keyword: value })}
					loading={loading}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Parent Category"
							placeholder="Search Category"
							sx={{ mt: 2 }}
							slotProps={{
								inputLabel: {
									shrink: true
								}
							}}
						/>
					)}
				/>
			</CommonDialog>
			<Snackbar
				open={!!errorMessage}
				autoHideDuration={4000}
				onClose={() => setErrorMessage(null)}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert onClose={() => setErrorMessage(null)} severity="error" variant="filled" sx={{ width: '100%' }}>
					{errorMessage}
				</Alert>
			</Snackbar>

			<Snackbar
				open={!!successMessage}
				autoHideDuration={3000}
				onClose={() => setSuccessMessage(null)}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert onClose={() => setSuccessMessage(null)} severity="success" variant="filled" sx={{ width: '100%' }}>
					{successMessage}
				</Alert>
			</Snackbar>
		</>
	);
}
