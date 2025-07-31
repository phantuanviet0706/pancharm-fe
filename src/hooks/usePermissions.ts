import { useEffect, useState } from 'react';
import { fetchData, Permission, PermissionQuery } from '../api/permissionService';

export function usePermissions(query: PermissionQuery = {}) {
	const [permissions, setPermissions] = useState<Permission[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		fetchData(query)
			.then((res) => {
				var data = [];
				const mock_data = res.result;
				if (typeof mock_data.content !== undefined && mock_data.content.length > 0) data = mock_data.content;

				setPermissions(data);
				setTotal(mock_data.totalElements || 0);
				setTotalPages(mock_data.totalPages || 1);
			})
			.catch((err) => setError(err))
			.finally(() => setLoading(false));
	}, [query]);

	return { permissions, setPermissions, loading, error, total, totalPages };
}
