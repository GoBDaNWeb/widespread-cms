import { queryOptions } from '@tanstack/react-query';

import { getImagesByProduct } from './image.api';

export const imageQueries = {
	all: () => ({ queryKey: ['image'] as const }),
	byProduct: (productId: number) =>
		queryOptions({
			queryKey: [...imageQueries.all().queryKey, productId],
			queryFn: () => getImagesByProduct(productId),
			enabled: !!productId
		})
};
