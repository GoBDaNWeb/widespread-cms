import { describe, expect, it } from 'vitest';

import { validateProductsSearch } from './validateProductsSearch';

describe('validateProductsSearch', () => {
	describe('pagination', () => {
		it('defaults page and page_size when missing', () => {
			expect(validateProductsSearch({})).toEqual({ page: 1, page_size: 10 });
		});

		it('keeps positive page and page_size', () => {
			const result = validateProductsSearch({ page: 3, page_size: 25 });
			expect(result.page).toBe(3);
			expect(result.page_size).toBe(25);
		});

		it('coerces numeric strings', () => {
			const result = validateProductsSearch({ page: '4', page_size: '50' });
			expect(result.page).toBe(4);
			expect(result.page_size).toBe(50);
		});

		it('falls back to defaults for non-positive or invalid values', () => {
			expect(validateProductsSearch({ page: 0, page_size: -5 })).toMatchObject({
				page: 1,
				page_size: 10
			});
			expect(validateProductsSearch({ page: 'abc', page_size: 'xyz' })).toMatchObject({
				page: 1,
				page_size: 10
			});
		});
	});

	describe('search', () => {
		it('trims and keeps a non-empty query', () => {
			expect(validateProductsSearch({ search: '  shoes  ' }).search).toBe('shoes');
		});

		it('omits empty or whitespace-only queries', () => {
			expect(validateProductsSearch({ search: '   ' })).not.toHaveProperty('search');
			expect(validateProductsSearch({ search: '' })).not.toHaveProperty('search');
		});

		it('omits non-string queries', () => {
			expect(validateProductsSearch({ search: 123 })).not.toHaveProperty('search');
		});
	});

	describe('category_id and brand_id', () => {
		it('keeps positive ids and coerces strings', () => {
			const result = validateProductsSearch({ category_id: '5', brand_id: 7 });
			expect(result.category_id).toBe(5);
			expect(result.brand_id).toBe(7);
		});

		it('omits falsy (zero) ids', () => {
			const result = validateProductsSearch({ category_id: 0, brand_id: 0 });
			expect(result).not.toHaveProperty('category_id');
			expect(result).not.toHaveProperty('brand_id');
		});

		it('omits invalid ids', () => {
			const result = validateProductsSearch({ category_id: 'nope', brand_id: '' });
			expect(result).not.toHaveProperty('category_id');
			expect(result).not.toHaveProperty('brand_id');
		});
	});

	describe('gender', () => {
		it.each(['male', 'female'])('keeps valid gender %s', gender => {
			expect(validateProductsSearch({ gender }).gender).toBe(gender);
		});

		it('omits invalid gender', () => {
			expect(validateProductsSearch({ gender: 'other' })).not.toHaveProperty('gender');
		});
	});

	describe('is_published', () => {
		it('parses boolean-like values', () => {
			expect(validateProductsSearch({ is_published: 'true' }).is_published).toBe(true);
			expect(validateProductsSearch({ is_published: false }).is_published).toBe(false);
		});

		it('omits non-boolean values', () => {
			expect(validateProductsSearch({ is_published: 'maybe' })).not.toHaveProperty('is_published');
		});
	});

	describe('price range', () => {
		it('keeps numeric prices including zero', () => {
			const result = validateProductsSearch({ min_price: 0, max_price: '500' });
			expect(result.min_price).toBe(0);
			expect(result.max_price).toBe(500);
		});

		it('omits invalid prices', () => {
			const result = validateProductsSearch({ min_price: 'cheap', max_price: '' });
			expect(result).not.toHaveProperty('min_price');
			expect(result).not.toHaveProperty('max_price');
		});
	});

	describe('size_ids', () => {
		it('normalizes an array, dropping invalid entries', () => {
			expect(validateProductsSearch({ size_ids: ['1', 2, 'bad'] }).size_ids).toEqual([1, 2]);
		});

		it('wraps a single value into an array', () => {
			expect(validateProductsSearch({ size_ids: '3' }).size_ids).toEqual([3]);
		});

		it('omits the key when no valid ids remain', () => {
			expect(validateProductsSearch({ size_ids: ['x'] })).not.toHaveProperty('size_ids');
			expect(validateProductsSearch({ size_ids: null })).not.toHaveProperty('size_ids');
		});
	});

	describe('sort_by and order', () => {
		it.each(['id', 'title', 'price'])('keeps valid sort_by %s', sort_by => {
			expect(validateProductsSearch({ sort_by }).sort_by).toBe(sort_by);
		});

		it.each(['asc', 'desc'])('keeps valid order %s', order => {
			expect(validateProductsSearch({ order }).order).toBe(order);
		});

		it('omits invalid sort_by and order', () => {
			const result = validateProductsSearch({ sort_by: 'name', order: 'up' });
			expect(result).not.toHaveProperty('sort_by');
			expect(result).not.toHaveProperty('order');
		});
	});

	it('builds a full search object from mixed raw input', () => {
		const result = validateProductsSearch({
			page: '2',
			page_size: '20',
			search: ' boots ',
			category_id: '5',
			brand_id: '6',
			gender: 'female',
			is_published: 'false',
			min_price: '10',
			max_price: '90',
			size_ids: ['1', '2'],
			sort_by: 'price',
			order: 'desc'
		});

		expect(result).toEqual({
			page: 2,
			page_size: 20,
			search: 'boots',
			category_id: 5,
			brand_id: 6,
			gender: 'female',
			is_published: false,
			min_price: 10,
			max_price: 90,
			size_ids: [1, 2],
			sort_by: 'price',
			order: 'desc'
		});
	});
});
