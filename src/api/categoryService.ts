import axios from 'axios';
import { BaseQuery } from './commonService';
import axiosClient from './axiosClient';

const API_URL = `${import.meta.env.VITE_APP_URL}/categories`;

export interface Category {
	id?: number;
	name: string;
	slug: string;
	config?: JSON;
	parentId?: number;
	parentName?: string;
	categories?: number[];
	createdAt?: Date;
	updatedAt?: Date;
	createdBy?: number;
}

export interface CategoryQuery extends BaseQuery {
	parentId?: number;
}

export const DEFAULT_CATEGORY: Category = { name: '', slug: '', parentId: 0 };

export const fetchData = async (query: CategoryQuery = {}) => {
	const params = new URLSearchParams();
	Object.entries(query).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			params.append(key, String(value));
		}
	});

	try {
		const res = await axios.get<{ data: Category[]; total: number }>(`${API_URL}?${params.toString()}`);
		return res.data;
	} catch (error) {
		console.error('Failed to fetch categories:', error);
		throw error;
	}
};

export const createCategory = async (payload: Omit<Category, 'id'>) => {
	try {
		const res = await axiosClient.post<Category>(API_URL, payload);
		return res.data;
	} catch (error) {
		console.error('Failed to create category:', error);
		throw error;
	}
};

export const updateCategory = async (id: number, payload: Partial<Category>) => {
	try {
		const res = await axiosClient.put<Category>(`${API_URL}/${id}`, payload);
		return res.data;
	} catch (error) {
		console.error('Failed to update category:', error);
		throw error;
	}
};

export const deleteCategory = async (id: number) => {
	try {
		const res = await axiosClient.delete<Category>(`${API_URL}/${id}`);
		return res.data;
	} catch (error) {
		console.error('Failed to delete category:', error);
		throw error;
	}
};

export const getCategory = async (id: number) => {
	try {
		const res = await axios.get<Category>(`${API_URL}/${id}`);
		return res.data;
	} catch (error) {
		console.error('Failed to get category:', error);
		throw error;
	}
};
