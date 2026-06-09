import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProduct, productQueries } from '@/entities/product';

export const useBulkDeleteProducts = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (ids: number[]) => Promise.all(ids.map(id => deleteProduct(id))),
		onSuccess: () => {
			qc.invalidateQueries(productQueries.lists());
		}
	});
};
