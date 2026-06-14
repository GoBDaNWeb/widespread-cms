import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makePendingImage as img } from '@/entities/image/model/image.fixtures';
import { makeProduct } from '@/entities/product/model/product.fixtures';

import { createQueryWrapper } from '@/shared/test/createQueryWrapper';

import { useCreateProduct } from './useCreateProduct';

const createProduct = vi.fn();
const createImage = vi.fn();

vi.mock('@/entities/product', async importOriginal => {
	const actual = await importOriginal<typeof import('@/entities/product')>();
	return { ...actual, createProduct: (...a: unknown[]) => createProduct(...a) };
});

vi.mock('@/entities/image', () => ({
	createImage: (...a: unknown[]) => createImage(...a)
}));

const product = {
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

beforeEach(() => {
	vi.clearAllMocks();
	createProduct.mockResolvedValue(makeProduct({ id: 99 }));
	createImage.mockResolvedValue({});
});

describe('useCreateProduct', () => {
	it('creates the product without images', async () => {
		const { wrapper } = createQueryWrapper();
		const { result } = renderHook(() => useCreateProduct(), { wrapper });

		result.current.mutate({ product, images: [] });

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(createProduct).toHaveBeenCalledWith(product);
		expect(createImage).not.toHaveBeenCalled();
		expect(result.current.data).toMatchObject({ id: 99 });
	});

	it('creates images for the new product with sequential order', async () => {
		const { wrapper } = createQueryWrapper();
		const { result } = renderHook(() => useCreateProduct(), { wrapper });

		result.current.mutate({
			product,
			images: [img({ url: 'a.jpg', alt: 'a' }), img({ url: 'b.jpg', alt: 'b' })]
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(createImage).toHaveBeenCalledTimes(2);
		expect(createImage).toHaveBeenNthCalledWith(1, {
			product_id: 99,
			url: 'a.jpg',
			alt: 'a',
			order: 0
		});
		expect(createImage).toHaveBeenNthCalledWith(2, {
			product_id: 99,
			url: 'b.jpg',
			alt: 'b',
			order: 1
		});
	});

	it('invalidates the products list query on settle', async () => {
		const { queryClient, wrapper } = createQueryWrapper();
		const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
		const { result } = renderHook(() => useCreateProduct(), { wrapper });

		result.current.mutate({ product, images: [] });

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(invalidate).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ['products', 'list'] })
		);
	});

	it('surfaces an error when product creation fails', async () => {
		createProduct.mockRejectedValueOnce(new Error('boom'));
		const { wrapper } = createQueryWrapper();
		const { result } = renderHook(() => useCreateProduct(), { wrapper });

		result.current.mutate({ product, images: [] });

		await waitFor(() => expect(result.current.isError).toBe(true));
		expect(result.current.error).toEqual(new Error('boom'));
	});
});
