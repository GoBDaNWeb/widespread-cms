import { queryOptions } from '@tanstack/react-query';

import axios from 'axios';

import { getMe } from '@/entities/user';

export const authQueries = {
	all: () => ({ queryKey: ['auth'] as const }),
	me: () =>
		queryOptions({
			queryKey: [...authQueries.all().queryKey, 'me'],
			queryFn: async () => {
				try {
					const result = await getMe();
					return result;
				} catch (e) {
					if (axios.isAxiosError(e) && [401, 403].includes(e.response?.status ?? 0)) {
						return null;
					}
					throw e;
				}
			},
			retry: false
		})
};
