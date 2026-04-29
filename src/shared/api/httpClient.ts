import axios, {
	type AxiosInstance,
	type AxiosResponse,
	type InternalAxiosRequestConfig
} from 'axios';

import { tokenService } from './tokenService';

export type RefreshFn = () => Promise<{ access_token: string }>;

type FailedRequest = {
	resolve: (token: string) => void;
	reject: (error: unknown) => void;
};

export const createHttpClient = (refreshFn: RefreshFn): AxiosInstance => {
	const client = axios.create({
		url: 'http://127.0.0.1:8000',
		baseURL: '/api',
		withCredentials: true
	});

	client.interceptors.request.use(
		(config: InternalAxiosRequestConfig) => {
			const token = tokenService.get();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		error => Promise.reject(error)
	);

	let isRefreshing = false;
	let failedQueue: FailedRequest[] = [];

	const processQueue = (error: unknown, token: string | null = null) => {
		failedQueue.forEach(({ resolve, reject }) => {
			if (error) {
				reject(error);
			} else {
				resolve(token!);
			}
		});
		failedQueue = [];
	};

	client.interceptors.response.use(
		(response: AxiosResponse) => response,
		async error => {
			const originalRequest = error.config as InternalAxiosRequestConfig & {
				_retry?: boolean;
			};

			if (
				error.response?.status !== 401 ||
				originalRequest._retry ||
				originalRequest.url === '/auth/refresh_token'
			) {
				return Promise.reject(error);
			}

			// Если refresh уже идёт — ставим запрос в очередь
			if (isRefreshing) {
				return new Promise<string>((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(token => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						return client(originalRequest);
					})
					.catch(Promise.reject.bind(Promise));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const { access_token } = await refreshFn();

				tokenService.set(access_token);
				processQueue(null, access_token);

				originalRequest.headers.Authorization = `Bearer ${access_token}`;
				return client(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);
				tokenService.clear();

				// Редирект на логин — через событие, чтобы shared не знал о роутере
				window.dispatchEvent(new CustomEvent('auth:logout'));

				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}
	);

	return client;
};

const refreshFn = () => axios.post('/api/auth/refresh_token').then(r => r.data);

export const httpClient = createHttpClient(refreshFn);
