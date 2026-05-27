import { queryOptions } from '@tanstack/react-query';

import { getSizes } from './size.api';

export const sizeQueries = {
	all: () => ({ queryKey: ['sizes'] as const }),
	list: () =>
		queryOptions({
			queryKey: sizeQueries.all().queryKey,
			queryFn: getSizes
		})
};
