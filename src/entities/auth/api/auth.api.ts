import { type IUser } from '@/entities/user';

import { httpClient, publicClient } from '@/shared/api';

export const refreshToken = () =>
	publicClient.post<{ accessToken: string }>('/auth/refresh_token').then(r => r.data);

export const login = (username: string, password: string) =>
	publicClient
		.post<{ user: IUser; accessToken: string }>('/auth/login', {
			username,
			password
		})
		.then(r => r.data);

export const logout = () => httpClient.post('/auth/logout');
