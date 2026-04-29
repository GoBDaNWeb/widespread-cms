const ACCESS_KEY = 'access_token';

export const tokenService = {
	get: () => localStorage.getItem(ACCESS_KEY),
	set: (token: string) => localStorage.setItem(ACCESS_KEY, token),
	clear: () => localStorage.removeItem(ACCESS_KEY)
};
