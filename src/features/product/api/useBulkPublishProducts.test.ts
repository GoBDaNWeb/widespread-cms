import { renderHook, waitFor } from '@testing-library/react';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeProduct } from '@/entities/product/model/product.fixtures';

import { createQueryWrapper } from '@/shared/test/createQueryWrapper';

import { useBulkPublishProducts } from './useBulkPublishProducts';

const updateProduct = vi.fn();

vi.mock('@/entities/product', async importOriginal => {
	const actual = await importOriginal<typeof import('@/entities/product')>();
	return { ...actual, updateProduct: (...a: unknown[]) => updateProduct(...a) };
});

beforeEach(() => {
	vi.clearAllMocks();
	updateProduct.mockImplementation((id: number) => Promise.resolve(makeProduct({ id })));
});

describe('useBulkPublishProducts', () => {
	it('updates every product with the requested published flag', async () => {
		const products = [
			makeProduct({ id: 1, is_published: false }),
			makeProduct({ id: 2, is_published: false })
		];
		const { wrapper } = createQueryWrapper();
		const { result } = renderHook(() => useBulkPublishProducts(), { wrapper });

		result.current.mutate({ products, is_published: true });

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(updateProduct).toHaveBeenCalledTimes(2);
		expect(updateProduct).toHaveBeenCalledWith(1, expect.objectContaining({ is_published: true }));
		expect(updateProduct).toHaveBeenCalledWith(2, expect.objectContaining({ is_published: true }));
	});

	it('maps the product fields into the update payload and flattens size ids', async () => {
		const product = makeProduct({
			id: 5,
			sizes: [
				{ id: 30, name: 'M' },
				{ id: 31, name: 'L' }
			]
		});
		const { wrapper } = createQueryWrapper();
		const { result } = renderHook(() => useBulkPublishProducts(), { wrapper });

		result.current.mutate({ products: [product], is_published: false });

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(updateProduct).toHaveBeenCalledWith(5, {
			title: product.title,
			description: product.description,
			brand_id: product.brand_id,
			price: product.price,
			sale_price: product.sale_price,
			slug: product.slug,
			gender: product.gender,
			is_published: false,
			is_archived: product.is_archived,
			category_id: product.category_id,
			size_ids: [30, 31]
		});
	});

	it('invalidates the products list on success', async () => {
		const { queryClient, wrapper } = createQueryWrapper();
		const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
		const { result } = renderHook(() => useBulkPublishProducts(), { wrapper });

		result.current.mutate({ products: [makeProduct({ id: 1 })], is_published: true });

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(invalidate).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ['products', 'list'] })
		);
	});

	it('does not call the api for an empty selection', async () => {
		const { wrapper } = createQueryWrapper();
		const { result } = renderHook(() => useBulkPublishProducts(), { wrapper });

		result.current.mutate({ products: [], is_published: true });

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(updateProduct).not.toHaveBeenCalled();
	});
});
