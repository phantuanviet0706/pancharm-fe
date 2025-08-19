import { CompanyInfo, CompanyInfoQuery, fetchData } from 'api/companyInfoService';
import { useEffect, useState } from 'react';

export function useCompanyInfos(query: CompanyInfoQuery = {}) {
	const [companyInfos, setCompanyInfos] = useState<CompanyInfo[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		fetchData(query)
			.then((res) => {
				const mock_data = res.result;

				setCompanyInfos(mock_data.content || []);
				setTotal(mock_data.totalElements || 0);
				setTotalPages(mock_data.totalPages || 1);
			})
			.catch((err) => setError(err))
			.finally(() => setLoading(false));
	}, [query]);

	return { companyInfos, setCompanyInfos, loading, error, total, totalPages };
}
