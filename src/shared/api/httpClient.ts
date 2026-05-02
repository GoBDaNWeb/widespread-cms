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
	onAuthFailure?: () => void;
	refreshTimeout?: number;
};

export const createHttpClient = ({
	baseURL = '/api',
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

	client.interceptors.response.use(
		(response: AxiosResponse) => response,
		async error => {
			const originalRequest = error.config as InternalAxiosRequestConfig & {
				_retry?: boolean;
			};

			if (error.response?.status !== 401 || originalRequest._retry) {
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
				await refreshClient.post('/api/auth/refresh_token');
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

export const baseClient = axios.create({
	baseURL: '/api',
	withCredentials: true
});

export const httpClient = createHttpClient({
	onAuthFailure: () => {
		window.dispatchEvent(new CustomEvent('auth:logout'));
	}
});
