import { fetchData, Role, RoleQuery } from 'api/roleService';
import { useEffect, useState } from 'react';

export function useRoles(query: RoleQuery = {}) {
	const [roles, setRoles] = useState<Role[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		fetchData(query)
			.then((res) => {
				const mock_data = res.result;

				setRoles(mock_data.content || []);
				setRoles(
					(mock_data.content || []).map((role: any) => ({
						...role,
						permissions: (role.permissions || []).map((perm: any) => perm.name)
					}))
				);
				setTotal(mock_data.totalElements || 0);
				setTotalPages(mock_data.totalPages || 1);
			})
			.catch((err) => setError(err))
			.finally(() => setLoading(false));
	}, [query]);

	return { roles, setRoles, loading, total, totalPages, error };
}
