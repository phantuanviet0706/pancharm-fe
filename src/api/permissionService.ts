import axios from 'axios';
import { forEach, values } from 'lodash-es';

const API_URL = `${import.meta.env.VITE_APP_URL}/permissions`;

export interface Permission {
	id: number;
	name: string;
	description: string;
}

export interface PermissionQuery {
	page?: number;
	limit?: number;
	name?: string;
}

export const fetchData = async (query: PermissionQuery = {}) => {
	const params = new URLSearchParams();
	Object.entries(query).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			params.append(key, String(value));
		}
	});

	const res = await axios.get<{ data: Permission[]; total: number }>(`${API_URL}?${params.toString()}`);
	return res.data;
};
