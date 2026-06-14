import { renderHook, waitFor } from '@testing-library/react';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryWrapper } from '@/shared/test/createQueryWrapper';

import { useDeleteProduct } from './useDeleteProduct';

const deleteProduct = vi.fn();

vi.mock('@/entities/product', async importOriginal => {
	const actual = await importOriginal<typeof import('@/entities/product')>();
	return { ...actual, deleteProduct: (...a: unknown[]) => deleteProduct(...a) };
});

beforeEach(() => {
	vi.clearAllMocks();
	deleteProduct.mockResolvedValue({ data: {} });
});

describe('useDeleteProduct', () => {
	it('deletes a single product by id', async () => {
		const { wrapper } = createQueryWrapper();
		const { result } = renderHook(() => useDeleteProduct(), { wrapper });

		result.current.mutate(7);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(deleteProduct).toHaveBeenCalledTimes(1);
		expect(deleteProduct.mock.calls[0][0]).toBe(7);
	});

	it('invalidates the products list on success', async () => {
		const { queryClient, wrapper } = createQueryWrapper();
		const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
		const { result } = renderHook(() => useDeleteProduct(), { wrapper });

		result.current.mutate(7);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(invalidate).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ['products', 'list'] })
		);
	});
});
