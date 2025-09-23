import axios from 'axios';
import { CollectionImage } from './collectionImageService';
import { BaseQuery } from './commonService';
import axiosClient from './axiosClient';

const API_URL = `${import.meta.env.VITE_APP_URL}/collections`;

export interface Collection {
	id?: number;
	name: string;
	slug?: string;
	description?: string;
	config?: JSON;

	collectionImages?: CollectionImage[];
	newImages?: File[];
	createdAt?: Date;
	updatedAt?: Date;
	createdBy?: number;
}

export interface CollectionQuery extends BaseQuery {}

export const DEFAULT_COLLECTION: Collection = {
	name: '',
	description: ''
};

export const fetchData = async (query: CollectionQuery = {}) => {
	const params = new URLSearchParams();
	Object.entries(query).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			params.append(key, String(value));
		}
	});

	try {
		const res = await axios.get<{ data: Collection[]; total: number }>(`${API_URL}?${params.toString()}`);
		return res.data;
	} catch (error) {
		console.error('Failed to fetch collections:', error);
		throw error;
	}
};

export const createCollection = async (payload: Omit<Collection, 'id'>) => {
	try {
		const res = await axiosClient.post<Collection>(API_URL, payload);
		return res.data;
	} catch (error) {
		console.error('Failed to create collection:', error);
		throw error;
	}
};

export const updateCollection = async (id: number, payload: Partial<Collection>) => {
	try {
		const res = await axiosClient.put<Collection>(`${API_URL}/${id}`, payload);
		return res.data;
	} catch (error) {
		console.error('Failed to update collection:', error);
		throw error;
	}
};

export const deleteCollection = async (id: number) => {
	try {
		const res = await axiosClient.delete<Collection>(`${API_URL}/${id}`);
		return res.data;
	} catch (error) {
		console.error('Failed to delete collection:', error);
		throw error;
	}
};

export const getCollection = async (id: number) => {
	try {
		const res = await axios.get<Collection>(`${API_URL}/${id}`);
		return res.data;
	} catch (error) {
		console.error('Failed to get collection:', error);
		throw error;
	}
};
