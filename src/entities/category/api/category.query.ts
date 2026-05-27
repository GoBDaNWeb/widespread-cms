import { queryOptions } from '@tanstack/react-query';

import { getCategories } from './category.api';

export const categoryQueries = {
	all: () => ({ queryKey: ['categories'] as const }),
	list: () =>
		queryOptions({
			queryKey: categoryQueries.all().queryKey,
			queryFn: getCategories
		})
};
