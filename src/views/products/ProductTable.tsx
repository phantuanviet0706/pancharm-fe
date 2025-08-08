import { Product } from 'api/productService';
import ActionMenu from 'components/ActionMenu/ActionMenu';
import GenericTable from 'components/Table/GenericTable';

interface ProductTableProps {
	products: Product[];
	onEdit: (perm: Product) => void;
	onDelete: (id: number) => void;
	onDetail: (id: number) => void;
}

export default function ProductTable({ products, onEdit, onDelete, onDetail }: ProductTableProps) {
	if (!products || !products.length) {
		return <p>No product found.</p>;
	}

	return (
		<GenericTable
			data={products}
			rowKey={(row) => (row?.id ? row.id : 0)}
			columns={[
				{ key: 'id', label: 'ID', width: '10vw' },
				{ key: 'name', label: 'Name', onClick: (row) => onDetail(row?.id ? row.id : 0) },
				{ key: 'slug', label: 'Slug' },
				{ key: 'quantity', label: 'Quantity' },
				{ key: 'unitPrice', label: 'Unit Price' },
				{ key: 'status', label: 'Status' },
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
		></GenericTable>
	);
}
