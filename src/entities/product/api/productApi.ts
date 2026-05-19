import { type IProductResponse } from '@/entities/product';

import { httpClient } from '@/shared/api';

export const getProducts = (pageSize: number, page: number) =>
	httpClient
		.get<IProductResponse>(`/products/get_products?page_size=${pageSize}&page=${page}`)
		.then(r => r.data);
