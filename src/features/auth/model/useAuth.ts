import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { ROUTES } from '@/shared/config';

import { login, logout } from '../api/authApi';

interface ILoginCredentials {
	username: string;
	password: string;
}

export const AUTH_KEY = ['auth', 'me'] as const;

export const useLogin = () => {
	const qc = useQueryClient();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: ({ username, password }: ILoginCredentials) => login(username, password),
		onSuccess: async () => {
			await qc.refetchQueries({ queryKey: AUTH_KEY });
			navigate({ to: ROUTES.HOME });
		}
	});
};

export const useLogout = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			qc.clear();
		}
	});
};
