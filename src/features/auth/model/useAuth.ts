import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { login, logout } from '@/entities/auth';

import { ROUTES } from '@/shared/config';

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
		onSuccess: async data => {
			await qc.setQueryData(AUTH_KEY, data.user);
			navigate({ to: ROUTES.HOME });
		}
	});
};

export const useLogout = () => {
	const qc = useQueryClient();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			qc.clear();
			navigate({ to: ROUTES.AUTH });
		}
	});
};
