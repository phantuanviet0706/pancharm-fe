import { CompanyInfo } from 'api/companyInfoService';
import ActionMenu from 'components/ActionMenu/ActionMenu';
import GenericTable from 'components/Table/GenericTable';

interface CompanyInfoProps {
	companyInfos: CompanyInfo[] | [];
	onEdit: (perm: CompanyInfo) => void;
	onDelete: (id: number) => void;
	onUserDetail?: (id: number) => void;
}

export default function CompanyInfoTable({ companyInfos, onEdit, onDelete, onUserDetail }: CompanyInfoProps) {
	if (!companyInfos || !companyInfos.length) {
		return <p>No company info found.</p>;
	}

	return (
		<GenericTable
			data={companyInfos}
			rowKey={(row) => (row?.id ? row.id : 0)}
			columns={[
				{
					key: 'pic',
					label: 'Person In Charge',
					render: (row) => {
						const pic = row.user;
						if (!pic) {
							return '---';
						}
						if (pic.fullname) {
							return pic.fullname;
						}
						return pic.username;
					},
					onClick: (row) => {
						const id = row?.user?.id;
						if (id == null) return;
						onUserDetail?.(id);
					}
				},
				{ key: 'address', label: 'Address' },
				{ key: 'phone', label: 'Phone' },
				{ key: 'email', label: 'Email' },
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
