import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { authQueries, logout } from '@/entities/auth';

import { ROUTES } from '@/shared/config';

export const useLogout = () => {
	const qc = useQueryClient();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: logout,
		onSuccess: async () => {
			qc.setQueryData(authQueries.me().queryKey, null);
			qc.clear();
			await navigate({ to: ROUTES.AUTH });
		}
	});
};
