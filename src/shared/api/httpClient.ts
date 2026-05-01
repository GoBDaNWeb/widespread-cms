import axios, {
	type AxiosInstance,
	type AxiosResponse,
	type InternalAxiosRequestConfig
} from 'axios';

type FailedRequest = {
	resolve: () => void;
	reject: (error: unknown) => void;
};

type HttpClientOptions = {
	baseURL?: string;
	refreshTokenUrl?: string;
	excludedUrls?: string[];
	onAuthFailure?: () => void;
	refreshTimeout?: number;
};

export const createHttpClient = ({
	baseURL = '/api',
	refreshTokenUrl = '/auth/refresh_token',
	excludedUrls = [],
	onAuthFailure,
	refreshTimeout = 10_000
}: HttpClientOptions = {}): AxiosInstance => {
	const client = axios.create({
		baseURL,
		withCredentials: true
	});

	const refreshClient = axios.create({
		withCredentials: true,
		timeout: refreshTimeout
	});

	let isRefreshing = false;
	let failedQueue: FailedRequest[] = [];

	const processQueue = (error: unknown) => {
		const queue = [...failedQueue];
		failedQueue = [];

		queue.forEach(({ resolve, reject }) => {
			if (error) reject(error);
			else resolve();
		});
	};

	const isExcludedUrl = (url?: string): boolean => {
		if (!url) return false;
		return [refreshTokenUrl, ...excludedUrls].some(excluded => url.includes(excluded));
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
				isExcludedUrl(originalRequest.url)
			) {
				return Promise.reject(error);
			}

			if (isRefreshing) {
				return new Promise<void>((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => client(originalRequest))
					.catch(err => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				await refreshClient.post(refreshTokenUrl);
				processQueue(null);
				return client(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError);
				onAuthFailure?.();
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}
	);

	return client;
};

export const httpClient = createHttpClient({
	baseURL: '/api',
	refreshTokenUrl: '/auth/refresh_token',
	excludedUrls: ['/user/me'],
	onAuthFailure: () => {
		window.dispatchEvent(new CustomEvent('auth:logout'));
	},
	refreshTimeout: 10_000
});
