import axios from 'axios';

const API_URL = `${import.meta.env.VITE_APP_URL}/auth`;

export interface Auth {
	username: string;
	password: string;
	remeber?: boolean;
}

export interface AuthLogout {
	token: string;
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

export const logout = async (data: AuthLogout) => {
	const tokenFromStorage = localStorage.getItem('token') || sessionStorage.getItem('token') || '';

	const payload: AuthLogout = {
		token: data?.token ?? tokenFromStorage
	};

	try {
		const res = await axios.post(API_URL + '/logout', payload);
		return res.data;
	} catch (err) {
		console.error('Failed to logout:', err);
		throw err;
	} finally {
		localStorage.removeItem('token');
		sessionStorage.removeItem('token');

		window.location.assign('/pancharm/login');
	}
};
