import { type IProduct, type IProductCreate, type IProductResponse } from '@/entities/product';

import { httpClient } from '@/shared/api';

export const getProducts = (pageSize: number, page: number) =>
	httpClient
		.get<IProductResponse>(`/products/get_products?page_size=${pageSize}&page=${page}`)
		.then(r => r.data);

export const createProduct = (data: IProductCreate) =>
	httpClient.post<IProduct>('/products/create_product', data).then(r => r.data);

export const deleteProduct = (id: number) => httpClient.delete(`/products/delete_product/${id}`);
