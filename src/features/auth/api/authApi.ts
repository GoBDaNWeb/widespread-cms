import { type IUser } from '@/entities/user';

import { httpClient } from '@/shared/api';

export const refreshToken = () =>
	httpClient.post<{ accessToken: string }>('/auth/refresh_token').then(r => r.data);

export const login = (username: string, password: string) =>
	httpClient
		.post<{ user: IUser; accessToken: string }>('/auth/login', {
			username,
			password
		})
		.then(r => r.data);

export const logout = () => httpClient.post('/auth/logout');
