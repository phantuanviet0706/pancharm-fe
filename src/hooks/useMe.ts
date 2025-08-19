import { getMe, User } from 'api/userService';
import { useEffect, useState } from 'react';

export function useMe() {
	const [me, setMe] = useState<User>();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		getMe()
			.then((res) => {
				const data = res.result;

				setMe(data);
			})
			.catch((err) => setError(err))
			.finally(() => setLoading(false));
	}, []);

	return { loading, error, me, setMe };
}
