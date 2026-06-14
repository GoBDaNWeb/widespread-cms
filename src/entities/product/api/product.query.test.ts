import { describe, expect, it, vi } from 'vitest';

import { productQueries } from './product.query';

vi.mock('./product.api', () => ({
	getProduct: vi.fn(),
	getProducts: vi.fn()
}));

describe('productQueries', () => {
	it('builds the root key', () => {
		expect(productQueries.all().queryKey).toEqual(['products']);
	});

	it('nests the list key under the root', () => {
		expect(productQueries.lists().queryKey).toEqual(['products', 'list']);
	});

	it('includes filters in the list query key', () => {
		const filters = { page: 2, search: 'boots' };
		expect(productQueries.list(filters).queryKey).toEqual(['products', 'list', filters]);
	});

	it('defaults to an empty filters object for the list key', () => {
		expect(productQueries.list().queryKey).toEqual(['products', 'list', {}]);
	});

	it('builds a product detail key from the root', () => {
		expect(productQueries.product(42).queryKey).toEqual(['products', 42]);
	});

	it('wires queryFn for list and product', () => {
		expect(typeof productQueries.list().queryFn).toBe('function');
		expect(typeof productQueries.product(1).queryFn).toBe('function');
	});
});
