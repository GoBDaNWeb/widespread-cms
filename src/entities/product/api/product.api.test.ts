import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeProduct } from '../model/product.fixtures';

import {
	createProduct,
	deleteProduct,
	getProduct,
	getProducts,
	updateProduct
} from './product.api';

const get = vi.fn();
const post = vi.fn();
const patch = vi.fn();
const del = vi.fn();

vi.mock('@/shared/api', () => ({
	httpClient: {
		get: (...args: unknown[]) => get(...args),
		post: (...args: unknown[]) => post(...args),
		patch: (...args: unknown[]) => patch(...args),
		delete: (...args: unknown[]) => del(...args)
	}
}));

beforeEach(() => {
	vi.clearAllMocks();
});

describe('getProduct', () => {
	it('requests the product by id and unwraps response data', async () => {
		const product = makeProduct();
		get.mockResolvedValue({ data: product });

		await expect(getProduct(1)).resolves.toEqual(product);
		expect(get).toHaveBeenCalledWith('/products/get_product/1');
	});
});

describe('getProducts', () => {
	const lastUrl = () => get.mock.calls[0][0] as string;
	const query = () => new URLSearchParams(lastUrl().split('?')[1] ?? '');

	beforeEach(() => {
		get.mockResolvedValue({ data: { items: [], total: 0, page: 1, page_size: 10, pages: 0 } });
	});

	it('requests with no query params when filters are empty', async () => {
		await getProducts();
		expect(lastUrl()).toBe('/products/get_products?');
	});

	it('serializes scalar filters into the query string', async () => {
		await getProducts({ page: 2, page_size: 20, search: 'boots', category_id: 5 });
		const params = query();
		expect(params.get('page')).toBe('2');
		expect(params.get('page_size')).toBe('20');
		expect(params.get('search')).toBe('boots');
		expect(params.get('category_id')).toBe('5');
	});

	it('skips undefined, null, and empty-string values', async () => {
		await getProducts({
			search: '',
			category_id: undefined,
			brand_id: null as unknown as number
		});
		expect(lastUrl()).toBe('/products/get_products?');
	});

	it('keeps boolean false and numeric zero values', async () => {
		await getProducts({ is_published: false, min_price: 0 });
		const params = query();
		expect(params.get('is_published')).toBe('false');
		expect(params.get('min_price')).toBe('0');
	});

	it('appends size_ids as repeated params', async () => {
		await getProducts({ size_ids: [1, 2, 3] });
		expect(query().getAll('size_ids')).toEqual(['1', '2', '3']);
	});

	it('omits size_ids entirely when the array is empty', async () => {
		await getProducts({ size_ids: [] });
		expect(query().getAll('size_ids')).toEqual([]);
	});
});

describe('createProduct', () => {
	it('posts the payload and returns created product', async () => {
		const product = makeProduct();
		post.mockResolvedValue({ data: product });
		const payload = {
			title: 't',
			description: 'd',
			brand_id: 1,
			price: 10,
			slug: 's',
			gender: 'male' as const,
			is_published: true,
			is_archived: false,
			category_id: 2,
			size_ids: [1]
		};

		await expect(createProduct(payload)).resolves.toEqual(product);
		expect(post).toHaveBeenCalledWith('/products/create_product', payload);
	});
});

describe('deleteProduct', () => {
	it('issues a delete request for the id', async () => {
		del.mockResolvedValue({ data: {} });
		await deleteProduct(7);
		expect(del).toHaveBeenCalledWith('/products/delete_product/7');
	});
});

describe('updateProduct', () => {
	it('patches the product by id and returns updated data', async () => {
		const product = makeProduct({ title: 'Updated' });
		patch.mockResolvedValue({ data: product });
		const payload = {
			title: 'Updated',
			description: 'd',
			brand_id: 1,
			price: 10,
			slug: 's',
			gender: 'female' as const,
			is_published: false,
			is_archived: false,
			category_id: 2,
			size_ids: [1, 2]
		};

		await expect(updateProduct(5, payload)).resolves.toEqual(product);
		expect(patch).toHaveBeenCalledWith('/products/update_product/5', payload);
	});
});
