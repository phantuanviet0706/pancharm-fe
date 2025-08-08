import { Autocomplete, TextField } from '@mui/material';
import { CategoryQuery, fetchData } from 'api/categoryService';
import { ProductImage } from 'api/productImageService';
import { DEFAULT_PRODUCT, Product, ProductQuery } from 'api/productService';
import CommonDialog from 'components/Dialog/GenericDialog';
import { useFormHandler } from 'hooks/useFormHandler';
import { useEffect, useState } from 'react';

type ActionType = 'create';

interface ProductFormProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: Partial<Product>) => Promise<{ code: number; message: string }>;
	initialData?: Product | null;
	onSuccess?: (code: number, message: string) => void;
	action?: ActionType;
}

export default function ProductForm({ open, onClose, onSubmit, initialData, onSuccess }: ProductFormProps) {
	const { form, setForm, handleSubmit } = useFormHandler<Product>(
		initialData ?? null,
		DEFAULT_PRODUCT,
		onSubmit,
		open,
		(form: Partial<Product>) => ({
			...form,
			categoryId: form.categoryId
		})
	);

	const [categoryOptions, setCategoryOptions] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);
	const [autocompleteOpen, setAutocompleteOpen] = useState(false);

	const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

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
		if (open && initialData) {
			setForm(initialData);
			setDeletedImageIds([]);
			if (initialData.categoryId) {
				handleCategorySearch({});
			}
		}
		if (!open) {
			setDeletedImageIds([]);
		}
	}, [open]);

	return (
		<>
			<CommonDialog
				open={open}
				title={initialData ? 'Edit Product' : 'Create Product'}
				onClose={onClose}
				maxWidth="md"
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
							handleSubmit(async (formDataOnly) => {
								const formData = new FormData();

								formData.append('name', form.name || '');
								formData.append('slug', form.slug || '');
								formData.append('categoryId', String(form.categoryId || ''));

								form.productImages
									?.filter((img) => !deletedImageIds.includes(img.id!))
									.forEach((img) => {
										formData.append('existingImages', img.id!.toString());
									});

								deletedImageIds.forEach((id) => {
									formData.append('deletedImageIds', id.toString());
								});

								form.newImages?.forEach((file) => {
									formData.append('productImages', file);
								});

								const res = await onSubmit(formData as unknown as Partial<Product>);
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

				<div className="form-group gi-2">
					<TextField
						label="Slug"
						fullWidth
						sx={{ mt: 2 }}
						value={form.slug || ''}
						onChange={(e) => setForm({ ...form, slug: e.target.value })}
					/>
					<TextField
						label="Slug"
						fullWidth
						sx={{ mt: 2 }}
						value={form.slug || ''}
						onChange={(e) => setForm({ ...form, slug: e.target.value })}
					/>
				</div>

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
						categoryOptions.find((cat) => cat.id === form.categoryId) ??
						(form.categoryId && form.categoryName ? { id: form.categoryId, name: form.parentName } : null)
					}
					onChange={(_, newValue) => {
						setForm({
							...form,
							categoryId: newValue?.id
						});
					}}
					onInputChange={(_, value) => handleCategorySearch({ keyword: value })}
					loading={loading}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Category *"
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

				<input
					type="file"
					multiple
					accept="image/*"
					onChange={(e) => {
						const files = e.target.files ? Array.from(e.target.files) : [];
						setForm({
							...form,
							newImages: files
						});
					}}
					style={{ marginTop: 16 }}
				/>

				{form.productImages
					?.filter((img) => !deletedImageIds.includes(img.id!))
					.map((img, index) => (
						<div key={img.id || index} style={{ position: 'relative', display: 'inline-block', margin: 8 }}>
							<img src={img.path} alt={`Image ${index}`} style={{ width: 100, height: 100, objectFit: 'cover' }} />
							<button
								type="button"
								onClick={() => {
									if (img.id != null) {
										setDeletedImageIds((prev) => [...prev, img.id!]);
									}
								}}
								style={{
									position: 'absolute',
									top: 0,
									right: 0,
									background: 'red',
									color: 'white',
									border: 'none',
									cursor: 'pointer',
									fontSize: 12,
									padding: '2px 5px'
								}}
							>
								X
							</button>
						</div>
					))}

				{form.newImages?.map((file, index) => (
					<img
						key={`new-${index}`}
						src={URL.createObjectURL(file)}
						alt={`New Upload ${index}`}
						style={{ width: 100, height: 100, objectFit: 'cover', margin: '8px' }}
					/>
				))}
			</CommonDialog>
		</>
	);
}
