import { renderHook, waitFor } from '@testing-library/react';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryWrapper } from '@/shared/test/createQueryWrapper';

import { useBulkDeleteProducts } from './useBulkDeleteProducts';

const deleteProduct = vi.fn();

vi.mock('@/entities/product', async importOriginal => {
	const actual = await importOriginal<typeof import('@/entities/product')>();
	return { ...actual, deleteProduct: (...a: unknown[]) => deleteProduct(...a) };
});

beforeEach(() => {
	vi.clearAllMocks();
	deleteProduct.mockResolvedValue({ data: {} });
});

describe('useBulkDeleteProducts', () => {
	it('deletes each id in the selection', async () => {
		const { wrapper } = createQueryWrapper();
		const { result } = renderHook(() => useBulkDeleteProducts(), { wrapper });

		result.current.mutate([1, 2, 3]);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(deleteProduct).toHaveBeenCalledTimes(3);
		expect(deleteProduct.mock.calls.map(c => c[0])).toEqual([1, 2, 3]);
	});

	it('invalidates the products list on success', async () => {
		const { queryClient, wrapper } = createQueryWrapper();
		const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
		const { result } = renderHook(() => useBulkDeleteProducts(), { wrapper });

		result.current.mutate([1]);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(invalidate).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ['products', 'list'] })
		);
	});

	it('fails the whole batch if one deletion rejects', async () => {
		deleteProduct.mockResolvedValueOnce({ data: {} }).mockRejectedValueOnce(new Error('nope'));
		const { wrapper } = createQueryWrapper();
		const { result } = renderHook(() => useBulkDeleteProducts(), { wrapper });

		result.current.mutate([1, 2]);

		await waitFor(() => expect(result.current.isError).toBe(true));
	});
});
