import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProduct, productQueries } from '@/entities/product';

export const useDeleteProduct = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: deleteProduct,
		onSuccess: () => {
			qc.invalidateQueries(productQueries.lists());
		}
	});
};
