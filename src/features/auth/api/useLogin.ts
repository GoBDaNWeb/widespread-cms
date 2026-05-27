import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { authQueries, login } from '@/entities/auth';
import type { IUserCredentials } from '@/entities/user';

import { ROUTES } from '@/shared/config';

export const useLogin = () => {
	const qc = useQueryClient();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: ({ username, password }: IUserCredentials) => login(username, password),
		onSuccess: data => {
			qc.setQueryData(authQueries.me().queryKey, data.user);
			navigate({ to: ROUTES.HOME });
		}
	});
};
