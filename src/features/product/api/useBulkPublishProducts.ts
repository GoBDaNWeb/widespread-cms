import { useMutation, useQueryClient } from '@tanstack/react-query';

import { type IProduct, productQueries, updateProduct } from '@/entities/product';

type BulkPublishPayload = {
	products: IProduct[];
	is_published: boolean;
};

export const useBulkPublishProducts = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ products, is_published }: BulkPublishPayload) =>
			Promise.all(
				products.map(p =>
					updateProduct(p.id, {
						title: p.title,
						description: p.description,
						brand_id: p.brand_id,
						price: p.price,
						sale_price: p.sale_price,
						slug: p.slug,
						gender: p.gender,
						is_published,
						is_archived: p.is_archived,
						category_id: p.category_id,
						size_ids: p.sizes.map(s => s.id)
					})
				)
			),
		onSuccess: () => {
			qc.invalidateQueries(productQueries.lists());
		}
	});
};
