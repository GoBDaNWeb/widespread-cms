import { queryOptions } from '@tanstack/react-query';

import { getMe } from '@/entities/user';

export const meQuery = queryOptions({
	queryKey: ['auth', 'me'],
	queryFn: async () => {
		try {
			return await getMe();
		} catch {
			return null;
		}
	},
	retry: false
});
