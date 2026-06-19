import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import type { IProductFilters } from '../model/types';

import { getProduct, getProducts, getProductsStats } from './product.api';

export const productQueries = {
	all: () => ({ queryKey: ['products'] as const }),

	lists: () => ({
		queryKey: [...productQueries.all().queryKey, 'list'] as const
	}),

	list: (filters: IProductFilters = {}) =>
		queryOptions({
			queryKey: [...productQueries.lists().queryKey, filters] as const,
			queryFn: () => getProducts(filters),
			placeholderData: keepPreviousData
		}),

	product: (productId: number) =>
		queryOptions({
			queryKey: [...productQueries.all().queryKey, productId] as const,
			queryFn: () => getProduct(productId)
		}),

	stats: () =>
		queryOptions({
			queryKey: [...productQueries.all().queryKey, 'stats'] as const,
			queryFn: getProductsStats
		})
};
