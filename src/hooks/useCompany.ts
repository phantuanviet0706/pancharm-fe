import { Company, getCompany } from 'api/companyService';
import { useEffect, useState } from 'react';

export function useCompany() {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState<Company>();

	useEffect(() => {
		setLoading(true);

		getCompany()
			.then((res) => {
				const mock_data = res.result;

				setData(mock_data);
			})
			.catch((err) => setError(err))
			.finally(() => setLoading(false));
	}, []);

	return { loading, error, data, setData };
}
