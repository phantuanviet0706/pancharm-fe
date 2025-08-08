import { BaseQuery } from './commonService';
import axiosClient from './axiosClient';

const API_URL = `${import.meta.env.VITE_APP_URL}/roles`;

export interface Role {
	id?: number;
	name: string;
	description: string;
	permissions?: string[];
}

export interface RoleQuery extends BaseQuery {}

export const DEFAULT_ROLE: Role = { name: '', description: '', permissions: [] };

export const fetchData = async (query: RoleQuery = {}) => {
	const params = new URLSearchParams();
	Object.entries(query).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			params.append(key, String(value));
		}
	});

	try {
		const res = await axiosClient.get<{ data: Role[]; total: number }>(`${API_URL}?${params.toString()}`);
		return res.data;
	} catch (error) {
		console.error('Failed to fetch roles:', error);
		throw error;
	}
};

export const createRole = async (payload: Omit<Role, 'id'>) => {
	try {
		const res = await axiosClient.post<Role>(API_URL, payload);
		return res.data;
	} catch (error) {
		console.error('Failed to create role:', error);
		throw error;
	}
};

export const updateRole = async (payload: Partial<Role>, id: number) => {
	try {
		const res = await axiosClient.put<Role>(`${API_URL}/${id}`, payload);
		return res.data;
	} catch (error) {
		console.error('Failed to update role:', error);
		throw error;
	}
};

export const deleteRole = async (id: number) => {
	try {
		const res = await axiosClient.delete<Role>(`${API_URL}/${id}`);
		return res.data;
	} catch (error) {
		console.error('Failed to delete role:', error);
		throw error;
	}
};
