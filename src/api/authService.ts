import axios from 'axios';

const API_URL = `${import.meta.env.VITE_APP_URL}/auth`;

export interface Auth {
	username: string;
	password: string;
	remeber?: boolean;
}

export const login = async (data: Auth) => {
	try {
		const res = await axios.post(API_URL + '/login', data);
		return res.data;
	} catch (err) {
		console.error('Failed to login:', err);
		throw err;
	}
};
