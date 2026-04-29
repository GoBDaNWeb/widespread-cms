import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tokenService } from '@/shared/api/tokenService';

import { login, logout } from '../api/authApi';

interface ILoginCredentials {
	username: string;
	password: string;
}

export const AUTH_KEY = ['auth', 'me'] as const;

export const useLogin = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ username, password }: ILoginCredentials) => login(username, password),
		onSuccess: ({ accessToken }) => {
			tokenService.set(accessToken);
			qc.invalidateQueries({ queryKey: AUTH_KEY });
		}
	});
};

export const useLogout = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			tokenService.clear();
			qc.clear();
		}
	});
};
