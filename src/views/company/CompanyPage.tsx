import { Company, updateCompany } from 'api/companyService';
import { useCompany } from 'hooks/useCompany';
import { useState } from 'react';
import CompanyForm from './CompanyForm';
import { icons } from 'assets/icons/icons';
import { Button } from '@mui/material';
import CompanyInfoTable from './info/CompanyInfoTable';
import { CompanyInfo, deleteCompanyInfo, updateCompanyInfo } from 'api/companyInfoService';
import GenericLabel from 'components/Dialog/GenericLabel';

export default function CompanyPage() {
	const { data, setData, loading, error } = useCompany();

	const [editData, setEditData] = useState<Company>();
	const [formOpen, setFormOpen] = useState(false);
	const [snackbarCode, setSnackbarCode] = useState<number>(0);
	const [snackbarMessage, setSnackbarMessage] = useState<string>('');

	const showSnackbar = (code: number, message: string) => {
		setSnackbarCode(code);
		setSnackbarMessage(message);
		setTimeout(() => setSnackbarCode(0), 3000);
	};

	const handleUpdate = async (patch: Partial<Company>) => {
		try {
			const res = await updateCompany(patch);
			if (res?.code === 1) {
				showSnackbar(1, res?.message || 'Cập nhật thành công');
				setFormOpen(false);
			} else {
				showSnackbar(res?.code ?? -1, res?.message || 'Cập nhật thất bại');
			}
			return { code: res?.code, message: res?.message };
		} catch (err: any) {
			const message = err?.response?.data?.message || err.message || 'Có lỗi xảy ra';
			showSnackbar(-1, message);
			return { code: -1, message };
		}
	};

	const handleEditCompanyInfos = async (data: Partial<CompanyInfo>) => {
		if (!data.id) return { code: -1, message: 'Missing ID for update' };
		try {
			const res = await updateCompanyInfo(data.id, data);
			if (res?.code === 1 && res?.result) {
			}
			return { code: res?.code, message: res?.message };
		} catch (err: any) {
			return {
				code: -1,
				message: err?.response?.data?.message || err.message
			};
		}
	};

	const handleDeleteCompanyInfos = async (id: number) => {
		try {
			const res = await deleteCompanyInfo(id);
			if (res?.code === 1) {
			}
			return { code: res?.code, message: res?.message };
		} catch (err: any) {
			return {
				code: -1,
				message: err?.response?.data?.message || err.message
			};
		}
	};

	const handleGetUserDetail = async (id: number) => {};

	if (loading) return <p>Đang tải ...</p>;
	if (error) return <p>Không thể tải thông tin công ty</p>;

	return (
		<div className="company-container">
			<div className="company-page">
				<h2 className="company-header-title">Thông tin công ty</h2>
				<div className="side-btn" style={{ top: '2vh', marginRight: '5px' }}>
					<Button
						className="btn-create-wrapper"
						variant="contained"
						onClick={() => {
							setEditData(data);
							setFormOpen(true);
						}}
					>
						Chỉnh sửa
					</Button>
				</div>

				<div className="sep"></div>

				<div className="company-info">
					<GenericLabel label="Tên" icon={icons.iconTag} value={data?.name || '—'} truncate />
					<GenericLabel label="Địa chỉ" icon={icons.iconLocation} value={data?.address || '—'} truncate />
					<GenericLabel label="Mã số thuế" icon={icons.iconId} value={data?.taxcode || '—'} truncate />
				</div>

				<CompanyForm open={formOpen} initialData={data as Company} onSubmit={handleUpdate} onClose={() => setFormOpen(false)} />
			</div>

			<div className="company-info-page">
				<CompanyInfoTable
					companyInfos={data?.companyInfos ?? []}
					onEdit={handleEditCompanyInfos}
					onDelete={handleDeleteCompanyInfos}
					onUserDetail={handleGetUserDetail}
				></CompanyInfoTable>
			</div>
		</div>
	);
}
