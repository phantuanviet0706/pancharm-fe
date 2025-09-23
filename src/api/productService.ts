import { ProductStatus } from 'constants/productStatus';
import { BaseQuery } from './commonService';
import { ProductImage } from './productImageService';
import axios from 'axios';
import axiosClient from './axiosClient';

const API_URL = `${import.meta.env.VITE_APP_URL}/products`;

export interface Product {
	id?: number;
	name: string;
	slug: string;
	status?: ProductStatus;
	unitPrice: number;
	quantity: number;
	description?: string;
	categoryId: number;
	categoryName?: string;
	config?: JSON;

	productImages?: ProductImage[];
	newImages?: File[];
	createdAt?: Date;
	updatedAt?: Date;
	createdBy?: number;
}

export interface ProductQuery extends BaseQuery {}

export const DEFAULT_PRODUCT: Product = {
	name: '',
	slug: '',
	status: ProductStatus.ACTIVE,
	unitPrice: 0,
	quantity: 1,
	description: '',
	categoryId: 0
};

export const fetchData = async (query: ProductQuery = {}) => {
	const params = new URLSearchParams();
	Object.entries(query).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			params.append(key, String(value));
		}
	});

	try {
		const res = await axios.get<{ data: Product[]; total: number }>(`${API_URL}?${params.toString()}`);
		return res.data;
	} catch (err) {
		console.error('Failed to fetch products:', err);
		throw err;
	}
};

export const createProduct = async (payload: Omit<Product, 'id'>) => {
	try {
		const res = await axiosClient.post<Product>(API_URL, payload);
		return res.data;
	} catch (error) {
		console.error('Failed to create product:', error);
		throw error;
	}
};

export const updateProduct = async (id: number, payload: Partial<Product>) => {
	try {
		const res = await axiosClient.put<Product>(`${API_URL}/${id}`, payload);
		return res.data;
	} catch (error) {
		console.error('Failed to update product:', error);
		throw error;
	}
};

export const deleteProduct = async (id: number) => {
	try {
		const res = await axiosClient.delete<Product>(`${API_URL}/${id}`);
		return res.data;
	} catch (error) {
		console.error('Failed to delete product:', error);
		throw error;
	}
};

export const getProduct = async (id: number) => {
	try {
		const res = await axios.get<Product>(`${API_URL}/${id}`);
		return res.data;
	} catch (error) {
		console.error('Failed to get product:', error);
		throw error;
	}
};
