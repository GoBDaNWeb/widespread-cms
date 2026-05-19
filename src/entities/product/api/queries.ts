import { queryOptions } from '@tanstack/react-query';

import { getProducts } from './productApi';

export const productsQuery = (pageSize: number = 10, page: number = 1) =>
	queryOptions({
		queryKey: ['products', pageSize, page],
		queryFn: () => getProducts(pageSize, page)
	});
