import { queryOptions } from '@tanstack/react-query';

import { getMe } from '@/entities/user';

export const meQuery = queryOptions({
	queryKey: ['auth', 'me'],
	queryFn: async () => {
		try {
			const result = await getMe();
			return result;
		} catch (e) {
			return null;
		}
	},
	retry: false
});
