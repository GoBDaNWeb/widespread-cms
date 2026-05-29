import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import { getProduct, getProducts } from './product.api';

export const productQueries = {
	all: () => ({ queryKey: ['products'] as const }),

	lists: () => ({
		queryKey: [...productQueries.all().queryKey, 'list'] as const
	}),

	list: (pageSize: number = 10, page: number = 1) =>
		queryOptions({
			queryKey: [...productQueries.lists().queryKey, pageSize, page] as const,
			queryFn: () => getProducts(pageSize, page),
			placeholderData: keepPreviousData
		}),

	product: (productId: number) =>
		queryOptions({
			queryKey: [...productQueries.all().queryKey, productId],
			queryFn: () => getProduct(productId)
		})
};
