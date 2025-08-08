import { Alert, Autocomplete, Snackbar, TextField } from '@mui/material';
import { Category, CategoryQuery, DEFAULT_CATEGORY, fetchData } from 'api/categoryService';
import CommonDialog from 'components/Dialog/GenericDialog';
import { useFormHandler } from 'hooks/useFormHandler';
import { useEffect, useState } from 'react';

interface CategoryFormProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: Partial<Category>) => Promise<{ code: number; message: string }>;
	initialData?: Category | null;
	onSuccess?: (code: number, message: string) => void;
}

export default function CategoryForm({ open, onClose, onSubmit, initialData, onSuccess }: CategoryFormProps) {
	const { form, setForm, handleSubmit } = useFormHandler<Category>(
		initialData ?? null,
		DEFAULT_CATEGORY,
		onSubmit,
		open,
		(form: Partial<Category>) => ({
			...form,
			parentId: form.parentId,
			parentName: form.parentName
		})
	);

	const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [autocompleteOpen, setAutocompleteOpen] = useState(false);

	const handleCategorySearch = async (query: CategoryQuery) => {
		query.limit = 0;
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
			if (initialData.parentId) {
				handleCategorySearch({});
			}
		} else {
			setForm(DEFAULT_CATEGORY);
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
						onClick: () =>
							handleSubmit((res) => {
								onSuccess?.(res.code, res.message);
								if (res.code === 1) onClose();
							}),
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
					isOptionEqualToValue={(option, value) => option.id === value.id}
					value={
						categoryOptions.find((cat) => cat.id === form.parentId) ??
						(form.parentId && form.parentName ? { id: form.parentId, name: form.parentName } : null)
					}
					onChange={(_, newValue) => {
						setForm({
							...form,
							parentId: newValue?.id
						});
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
		</>
	);
}
