import { BaseQuery } from './commonService';
import axiosClient from './axiosClient';

const API_URL = `${import.meta.env.VITE_APP_URL}/permissions`;

export interface Permission {
	id?: number;
	name: string;
	description: string;
}

export interface PermissionQuery extends BaseQuery {
	names?: string[];
}

export const DEFAULT_PERMISSION: Permission = { id: 0, name: '', description: '' };

export const fetchData = async (query: PermissionQuery = {}) => {
	const params = new URLSearchParams();
	Object.entries(query).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			params.append(key, String(value));
		}
	});

	try {
		const res = await axiosClient.get<{ data: Permission[]; total: number }>(`${API_URL}?${params.toString()}`);
		return res.data;
	} catch (error) {
		console.error('Failed to fetch permissions:', error);
		throw error;
	}
};

export const createPermission = async (payload: Omit<Permission, 'id'>) => {
	try {
		const res = await axiosClient.post<Permission>(API_URL, payload);
		return res.data;
	} catch (error) {
		console.error('Failed to create permission:', error);
		throw error;
	}
};

export const updatePermission = async (id: number, payload: Partial<Permission>) => {
	try {
		const res = await axiosClient.put<Permission>(`${API_URL}/${id}`, payload);
		return res.data;
	} catch (error) {
		console.error('Failed to update permission:', error);
		throw error;
	}
};

export const deletePermission = async (id: number) => {
	try {
		const res = await axiosClient.delete<Permission>(`${API_URL}/${id}`);
		return res.data;
	} catch (error) {
		console.error('Failed to delete permission:', error);
		throw error;
	}
};
