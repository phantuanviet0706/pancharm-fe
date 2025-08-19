import axiosClient from './axiosClient';
import { CompanyInfo } from './companyInfoService';

const API_URL = `${import.meta.env.VITE_APP_URL}/company`;

export interface Company {
	name: string;
	address?: string;
	avatar?: string;
	taxcode?: string;
	bankAttachment?: string;
	config?: JSON;
	companyInfos: CompanyInfo[];
}

export const updateCompany = async (payload: FormData | Partial<Company>) => {
	try {
		const res = await axiosClient.put(API_URL, payload);
		return res.data;
	} catch (error) {
		console.error('Failed to update company:', error);
		throw error;
	}
};

export const getCompany = async () => {
	try {
		const res = await axiosClient.get(API_URL);
		return res.data;
	} catch (error) {
		console.error('Failed to get company:', error);
		throw error;
	}
};
