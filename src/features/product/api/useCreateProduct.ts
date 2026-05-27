import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createImage } from '@/entities/image';
import type { PendingImage } from '@/entities/image';
import { createProduct, productQueries } from '@/entities/product';
import type { IProductCreate } from '@/entities/product';

type CreateProductPayload = {
	product: IProductCreate;
	images: PendingImage[];
};

const createProductWithImages = async ({ product, images }: CreateProductPayload) => {
	const created = await createProduct(product);
	if (images.length > 0) {
		await Promise.allSettled(
			images.map((img, index) =>
				createImage({ product_id: created.id, url: img.url, alt: img.alt, order: index })
			)
		);
	}
	return created;
};

export const useCreateProduct = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: createProductWithImages,
		onSettled: () => {
			qc.invalidateQueries(productQueries.lists());
		}
	});
};
