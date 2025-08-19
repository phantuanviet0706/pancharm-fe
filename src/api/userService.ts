import { UserMembership } from 'constants/userMembership';
import { UserStatus } from 'constants/userStatus';
import { BaseQuery } from './commonService';
import axios from 'axios';
import axiosClient from './axiosClient';
import { Role } from './roleService';

const API_URL = `${import.meta.env.VITE_APP_URL}/users`;

export interface User {
	id?: number;
	username: string;
	password?: string;
	email: string;
	fullname: string;
	dob?: Date;
	avatar?: string;
	address?: string;
	phone?: string;
	status?: UserStatus;
	membershipLevel?: UserMembership;
	totalSpent?: number;
	points?: number;
	config?: JSON;

	createdAt?: Date;
	updatedAt?: Date;

	roles?: Role[];
}

export interface UserQuery extends BaseQuery {}

export const DEFAULT_USER: User = {
	username: '',
	email: '',
	fullname: ''
};

export const fetchData = async (query: UserQuery = {}) => {
	const params = new URLSearchParams();
	Object.entries(query).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			params.append(key, String(value));
		}
	});

	try {
		const res = await axios.get<{ data: User[]; total: number }>(`${API_URL}?${params.toString()}`);
		return res.data;
	} catch (error) {
		console.error('Failed to fetch users:', error);
		throw error;
	}
};

export const createUser = async (payload: Omit<User, 'id'>) => {
	try {
		const res = await axios.post<User>(API_URL, payload);
		return res.data;
	} catch (error) {
		console.error('Failed to create user:', error);
		throw error;
	}
};

export const updateUser = async (id: number, payload: Partial<User>) => {
	try {
		const res = await axios.put<User>(`${API_URL}/${id}`, payload);
		return res.data;
	} catch (error) {
		console.error('Failed to update user:', error);
		throw error;
	}
};

export const deleteUser = async (id: number) => {
	try {
		const res = await axios.delete<User>(`${API_URL}/${id}`);
		return res.data;
	} catch (error) {
		console.error('Failed to delete user:', error);
		throw error;
	}
};

export const getUser = async (id: number) => {
	try {
		const res = await axios.get<User>(`${API_URL}/${id}`);
		return res.data;
	} catch (error) {
		console.error('Failed to get user:', error);
		throw error;
	}
};

export const getMe = async () => {
	try {
		const res = await axiosClient.get<User>(`${API_URL}/me`);
		return res.data;
	} catch (error) {
		console.error('Failed to get my info:', error);
		throw error;
	}
};
