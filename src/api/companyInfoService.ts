import axiosClient from './axiosClient';
import { BaseQuery } from './commonService';
import { User } from './userService';

const API_URL = `${import.meta.env.VITE_APP_URL}/company/info`;

export interface CompanyInfo {
	id: number;
	address: string;
	phone: string;
	email: string;
	user: User;
}

export interface CompanyInfoQuery extends BaseQuery {}

export const fetchData = async (query: CompanyInfoQuery = {}) => {
	const params = new URLSearchParams();
	Object.entries(query).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			params.append(key, String(value));
		}
	});

	try {
		const res = await axiosClient.get<{ data: CompanyInfo[]; total: number }>(`${API_URL}?${params.toString()}`);
		return res.data;
	} catch (error) {
		console.error('Failed to get company infos:', error);
		throw error;
	}
};

export const createCompanyInfo = async (data: Omit<CompanyInfo, 'id'>) => {
	try {
		const res = await axiosClient.post<CompanyInfo>(API_URL, data);
		return res.data;
	} catch (error) {
		console.error('Failed to create company info:', error);
		throw error;
	}
};

export const updateCompanyInfo = async (id: number, data: Partial<CompanyInfo>) => {
	try {
		const res = await axiosClient.put<CompanyInfo>(`${API_URL}/${id}`, data);
		return res.data;
	} catch (error) {
		console.error('Failed to update company info:', error);
		throw error;
	}
};

export const deleteCompanyInfo = async (id: number) => {
	try {
		const res = await axiosClient.delete<CompanyInfo>(`${API_URL}/${id}`);
		return res.data;
	} catch (error) {
		console.error('Failed to delete company info:', error);
		throw error;
	}
};

export const getCompanyInfo = async (id: number) => {
	try {
		const res = await axiosClient.get<CompanyInfo>(`${API_URL}/${id}`);
		return res.data;
	} catch (error) {
		console.error('Failed to get company info:', error);
		throw error;
	}
};
