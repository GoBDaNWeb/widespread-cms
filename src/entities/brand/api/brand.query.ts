import { queryOptions } from '@tanstack/react-query';

import { getBrands } from './brand.api';

export const brandQueries = {
	all: () => ({ queryKey: ['brands'] as const }),
	list: () =>
		queryOptions({
			queryKey: brandQueries.all().queryKey,
			queryFn: getBrands
		})
};
