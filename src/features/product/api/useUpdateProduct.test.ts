import { renderHook, waitFor } from '@testing-library/react';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makePendingImage as img } from '@/entities/image/model/image.fixtures';
import { productQueries } from '@/entities/product';
import type { IProduct, IProductResponse } from '@/entities/product';
import { makeProduct } from '@/entities/product/model/product.fixtures';

import { createQueryWrapper } from '@/shared/test/createQueryWrapper';

import { useUpdateProduct } from './useUpdateProduct';

const updateProduct = vi.fn();
const createImage = vi.fn();
const updateImage = vi.fn();
const deleteImage = vi.fn();

vi.mock('@/entities/product', async importOriginal => {
	const actual = await importOriginal<typeof import('@/entities/product')>();
	return { ...actual, updateProduct: (...a: unknown[]) => updateProduct(...a) };
});

vi.mock('@/entities/image', async importOriginal => {
	const actual = await importOriginal<typeof import('@/entities/image')>();
	return {
		...actual,
		createImage: (...a: unknown[]) => createImage(...a),
		updateImage: (...a: unknown[]) => updateImage(...a),
		deleteImage: (...a: unknown[]) => deleteImage(...a)
	};
});

const brand = { id: 10, name: 'Nike' };
const category = { id: 20, name: 'Footwear' };
const sizes = [{ id: 30, name: 'M' }];

const formData = {
	title: 'Updated title',
	slug: 'updated-title',
	description: 'Updated description',
	price: '150',
	gender: 'female' as const,
	brand_id: 10,
	category_id: 20,
	size_ids: [30],
	is_published: false
};

const basePayload = {
	id: 1,
	data: formData,
	images: [],
	originalImageIds: [],
	brand,
	category,
	sizes
};

beforeEach(() => {
	vi.clearAllMocks();
	updateProduct.mockImplementation((id: number) => Promise.resolve(makeProduct({ id })));
	createImage.mockResolvedValue({});
	updateImage.mockResolvedValue({});
	deleteImage.mockResolvedValue({});
});

describe('useUpdateProduct — payload', () => {
	it('coerces price, forces is_archived false, and defaults size_ids', async () => {
		const { wrapper } = createQueryWrapper();
		const { result } = renderHook(() => useUpdateProduct(), { wrapper });

		result.current.mutate(basePayload);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(updateProduct).toHaveBeenCalledWith(1, {
			...formData,
			price: 150,
			is_archived: false,
			size_ids: [30]
		});
	});
});

describe('useUpdateProduct — image reconciliation', () => {
	it('deletes images that are no longer present', async () => {
		const { wrapper } = createQueryWrapper();
		const { result } = renderHook(() => useUpdateProduct(), { wrapper });

		result.current.mutate({
			...basePayload,
			images: [img({ id: 100, url: 'keep.jpg' })],
			originalImageIds: [100, 101, 102]
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(deleteImage.mock.calls.map(c => c[0]).sort()).toEqual([101, 102]);
	});

	it('reorders kept images by their new index', async () => {
		const { wrapper } = createQueryWrapper();
		const { result } = renderHook(() => useUpdateProduct(), { wrapper });

		result.current.mutate({
			...basePayload,
			images: [img({ id: 200, url: 'a.jpg' }), img({ id: 201, url: 'b.jpg' })],
			originalImageIds: [200, 201]
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(updateImage).toHaveBeenCalledWith(200, { order: 0 });
		expect(updateImage).toHaveBeenCalledWith(201, { order: 1 });
		expect(deleteImage).not.toHaveBeenCalled();
	});

	it('creates new images (without id) using their position as order', async () => {
		const { wrapper } = createQueryWrapper();
		const { result } = renderHook(() => useUpdateProduct(), { wrapper });

		result.current.mutate({
			...basePayload,
			images: [img({ id: 300, url: 'old.jpg' }), img({ url: 'new.jpg', alt: 'new' })],
			originalImageIds: [300]
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(createImage).toHaveBeenCalledWith({
			product_id: 1,
			url: 'new.jpg',
			alt: 'new',
			order: 1
		});
		expect(updateImage).toHaveBeenCalledWith(300, { order: 0 });
	});
});

describe('useUpdateProduct — optimistic cache', () => {
	const seedCache = (queryClient: ReturnType<typeof createQueryWrapper>['queryClient']) => {
		const existing = makeProduct({ id: 1, title: 'Old title', is_published: true });
		queryClient.setQueryData<IProductResponse>(productQueries.lists().queryKey, {
			items: [existing],
			total: 1,
			page: 1,
			page_size: 10,
			pages: 1
		});
		queryClient.setQueryData<IProduct>(productQueries.product(1).queryKey, existing);
	};

	it('optimistically applies the update to list and detail caches', async () => {
		const { queryClient, wrapper } = createQueryWrapper();
		seedCache(queryClient);
		const { result } = renderHook(() => useUpdateProduct(), { wrapper });

		result.current.mutate(basePayload);

		await waitFor(() => {
			const detail = queryClient.getQueryData<IProduct>(productQueries.product(1).queryKey);
			expect(detail?.title).toBe('Updated title');
		});
		const list = queryClient.getQueryData<IProductResponse>(productQueries.lists().queryKey);
		expect(list?.items[0]).toMatchObject({
			title: 'Updated title',
			price: 150,
			is_published: false,
			brand,
			category
		});
	});

	it('rolls back the caches when the update fails', async () => {
		updateProduct.mockRejectedValueOnce(new Error('server down'));
		const { queryClient, wrapper } = createQueryWrapper();
		seedCache(queryClient);
		const { result } = renderHook(() => useUpdateProduct(), { wrapper });

		result.current.mutate(basePayload);

		await waitFor(() => expect(result.current.isError).toBe(true));
		const detail = queryClient.getQueryData<IProduct>(productQueries.product(1).queryKey);
		expect(detail?.title).toBe('Old title');
		expect(detail?.is_published).toBe(true);
	});

	it('invalidates product, list, and image queries on settle', async () => {
		const { queryClient, wrapper } = createQueryWrapper();
		const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
		const { result } = renderHook(() => useUpdateProduct(), { wrapper });

		result.current.mutate(basePayload);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		const invalidatedKeys = invalidate.mock.calls.map(
			c => (c[0] as { queryKey: unknown }).queryKey
		);
		expect(invalidatedKeys).toContainEqual(['products', 'list']);
		expect(invalidatedKeys).toContainEqual(['products', 1]);
		expect(invalidatedKeys).toContainEqual(['image', 1]);
	});
});
