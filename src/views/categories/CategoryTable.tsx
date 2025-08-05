import { Category } from 'api/categoryService';
import ActionMenu from 'components/ActionMenu/ActionMenu';
import GenericTable from 'components/Table/GenericTable';

interface CategoryTableProps {
	categories: Category[];
	onEdit: (perm: Category) => void;
	onDelete: (id: number) => void;
	onDetail: (id: number) => void;
}

export default function CategoryTable({ categories, onEdit, onDelete, onDetail }: CategoryTableProps) {
	if (!categories || !categories.length) {
		return <p>No category found.</p>;
	}

	return (
		<GenericTable
			data={categories}
			rowKey={(row) => row.id}
			columns={[
				{ key: 'id', label: 'ID', width: '10vw' },
				{ key: 'name', label: 'Name', onClick: (row) => onDetail(row.id) },
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
		/>
	);
}
