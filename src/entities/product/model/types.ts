import type { AttributeItem } from '@/shared/model';

type ProductImage = {
	id: number;
	product_id: number;
	url: string;
	alt?: string;
	order: number;
};

export interface IProduct {
	id: number;
	title: string;
	description: string;
	brand?: AttributeItem;
	brand_id?: number;
	price: number;
	sale_price?: number;
	slug: string;
	gender: 'male' | 'female';
	is_published: boolean;
	is_archived: boolean;
	category?: AttributeItem;
	category_id?: number;
	sizes: AttributeItem[];
	images?: ProductImage[];
}

export interface IProductCreate {
	title: string;
	description: string;
	brand_id?: number;
	price: number;
	sale_price?: number;
	slug: string;
	gender: 'male' | 'female';
	is_published: boolean;
	is_archived: boolean;
	category_id?: number;
	size_ids: number[];
}

export interface IProductResponse {
	items: IProduct[];
	total: number;
	page: number;
	page_size: number;
	pages: number;
}
