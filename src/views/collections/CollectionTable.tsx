import { Collection } from 'api/collectionService';
import ActionMenu from 'components/ActionMenu/ActionMenu';
import GenericTable from 'components/Table/GenericTable';

interface CollectionTableProps {
	collections: Collection[];
	onEdit: (perm: Collection) => void;
	onDelete: (id: number) => void;
	onDetail: (id: number) => void;
}

export default function CollectionTable({ collections, onEdit, onDelete, onDetail }: CollectionTableProps) {
	if (!collections || !collections.length) {
		return <p>Không tìm thấy bộ sưu tập.</p>;
	}

	return (
		<GenericTable
			data={collections}
			rowKey={(row) => (row?.id ? row.id : 0)}
			columns={[
				{ key: 'id', label: 'ID', width: '10vw' },
				{ key: 'name', label: 'Tên', onClick: (row) => onDetail(row?.id ? row.id : 0) },
				{ key: 'slug', label: 'Mã' },
				{
					key: 'actions',
					label: 'Thao tác',
					align: 'right',
					width: '100px',
					headerStyle: { marginRight: '10px' },
					render: (row) => (
						<ActionMenu
							actions={[
								{ label: 'Sửa', onClick: () => onEdit(row) },
								{ label: 'Xóa', onClick: () => onDelete(row?.id ? row.id : 0), color: 'red' }
							]}
						/>
					)
				}
			]}
		></GenericTable>
	);
}
