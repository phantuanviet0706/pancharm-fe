import { fetchData, User, UserQuery } from 'api/userService';
import { useEffect, useState } from 'react';

export function useUsers(query: UserQuery = {}) {
	const [users, setUsers] = useState<User[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		fetchData(query)
			.then((res) => {
				const mock_data = res.result;

				setUsers(mock_data.content || []);
				setTotal(mock_data.totalElements || 0);
				setTotalPages(mock_data.totalPages || 1);
			})
			.catch((err) => setError(err))
			.finally(() => setLoading(false));
	}, [query]);

	return { users, setUsers, loading, error, total, totalPages };
}
