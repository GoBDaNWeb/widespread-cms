import axios, {
	type AxiosInstance,
	type AxiosResponse,
	type InternalAxiosRequestConfig
} from 'axios';

type FailedRequest = {
	resolve: () => void;
	reject: (error: unknown) => void;
};

export const createHttpClient = (): AxiosInstance => {
	const client = axios.create({
		baseURL: '/api',
		withCredentials: true
	});

	let isRefreshing = false;
	let failedQueue: FailedRequest[] = [];

	const processQueue = (error: unknown) => {
		failedQueue.forEach(({ resolve, reject }) => {
			if (error) reject(error);
			else resolve();
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
				originalRequest.url === '/auth/refresh_token' ||
				originalRequest.url === '/api/user/me'
			) {
				return Promise.reject(error);
			}

			if (isRefreshing) {
				return new Promise<void>((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => client(originalRequest))
					.catch(Promise.reject.bind(Promise));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				await axios.post('/api/auth/refresh_token', null, {
					withCredentials: true
				});

				processQueue(null);
				return client(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError);
				window.dispatchEvent(new CustomEvent('auth:logout'));
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}
	);

	return client;
};

export const httpClient = createHttpClient();
