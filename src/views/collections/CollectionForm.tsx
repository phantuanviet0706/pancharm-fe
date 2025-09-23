import { TextField } from '@mui/material';
import { Collection, DEFAULT_COLLECTION } from 'api/collectionService';
import CommonDialog from 'components/Dialog/GenericDialog';
import { useFormHandler } from 'hooks/useFormHandler';
import { useEffect, useState } from 'react';

type ActionType = 'create';

interface CollectionFormProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: Partial<Collection>) => Promise<{ code: number; message: string }>;
	initialData?: Collection | null;
	onSuccess?: (code: number, message: string) => void;
	action?: ActionType;
}

export default function CollectionForm({ open, onClose, onSubmit, initialData, onSuccess }: CollectionFormProps) {
	const { form, setForm, handleSubmit } = useFormHandler<Collection>(initialData ?? null, DEFAULT_COLLECTION, onSubmit, open);

	const [loading, setLoading] = useState(false);
	const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

	useEffect(() => {
		if (open && initialData) {
			setForm(initialData);
			setDeletedImageIds([]);
		}
		if (!open) {
			setDeletedImageIds([]);
		}
	}, [open]);

	return (
		<>
			<CommonDialog
				open={open}
				title={initialData ? 'Edit Collection' : 'Create Collection'}
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
							handleSubmit(async () => {
								const formData = new FormData();

								formData.append('name', form.name || '');
								formData.append('slug', form.slug || '');
								formData.append('description', form.description || '');

								form.collectionImages
									?.filter((img) => !deletedImageIds.includes(img.id!))
									.forEach((img) => {
										formData.append('existingImages', img.id!.toString());
									});

								deletedImageIds.forEach((id) => {
									formData.append('deletedImageIds', id.toString());
								});

								form.newImages?.forEach((file) => {
									formData.append('collectionImages', file);
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
					label="Tên *"
					fullWidth
					sx={{ mt: 2 }}
					value={form.name || ''}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
				/>

				<TextField
					label="Mã"
					fullWidth
					sx={{ mt: 2 }}
					value={form.slug || ''}
					onChange={(e) => setForm({ ...form, slug: e.target.value })}
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

				{form.collectionImages
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
