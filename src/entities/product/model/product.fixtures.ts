import type { AttributeItem } from '@/shared/model';

import type { IProduct } from './types';

const attr = (id: number, name: string): AttributeItem => ({ id, name });

export const makeProduct = (overrides: Partial<IProduct> = {}): IProduct => ({
	id: 1,
	title: 'Running Shoes',
	description: 'Comfortable running shoes',
	brand: attr(10, 'Nike'),
	brand_id: 10,
	price: 100,
	sale_price: undefined,
	slug: 'running-shoes',
	gender: 'male',
	is_published: true,
	is_archived: false,
	category: attr(20, 'Footwear'),
	category_id: 20,
	sizes: [attr(30, 'M'), attr(31, 'L')],
	images: [],
	...overrides
});
