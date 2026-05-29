import { useMutation, useQueryClient } from '@tanstack/react-query';

import { type PendingImage, createImage, deleteImage, imageQueries } from '@/entities/image';
import {
	type IProduct,
	type IProductResponse,
	productQueries,
	updateProduct
} from '@/entities/product';

import type { AttributeItem } from '@/shared/model';

import type { CreateProductFormValues } from '../lib';

export type UpdateProductPayload = {
	id: number;
	data: CreateProductFormValues;
	images: PendingImage[];
	originalImageIds: number[];
	brand?: AttributeItem;
	category?: AttributeItem;
	sizes?: AttributeItem[];
};

const updateProductWithImage = async ({
	id,
	data,
	images,
	originalImageIds
}: UpdateProductPayload) => {
	const updated = await updateProduct(id, {
		...data,
		price: Number(data.price),
		is_archived: false
	});

	const keptIds = new Set(images.filter(img => img.id).map(img => img.id!));
	const toDelete = originalImageIds.filter(imageId => !keptIds.has(imageId));
	const toCreate = images.filter(img => !img.id);

	await Promise.all(toDelete.map(imageId => deleteImage(imageId)));
	await Promise.all(
		toCreate.map((img, index) =>
			createImage({ product_id: updated.id, url: img.url, alt: img.alt, order: index })
		)
	);
	return updated;
};

export const useUpdateProduct = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: updateProductWithImage,
		onMutate: async ({ id, data, brand, category, sizes }) => {
			await qc.cancelQueries({ queryKey: productQueries.lists().queryKey });
			await qc.cancelQueries({ queryKey: productQueries.product(id).queryKey });

			const previousLists = qc.getQueriesData<IProductResponse>({
				queryKey: productQueries.lists().queryKey
			});
			const previousProduct = qc.getQueryData<IProduct>(productQueries.product(id).queryKey);

			const applyUpdate = (product: IProduct): IProduct => ({
				...product,
				title: data.title,
				slug: data.slug,
				description: data.description,
				price: Number(data.price),
				gender: data.gender,
				is_published: data.is_published,
				brand_id: data.brand_id,
				category_id: data.category_id,
				brand,
				category,
				sizes: sizes ?? product.sizes
			});

			qc.setQueriesData<IProductResponse>(
				{ queryKey: productQueries.lists().queryKey },
				old => old && { ...old, items: old.items.map(p => (p.id === id ? applyUpdate(p) : p)) }
			);

			qc.setQueryData<IProduct>(
				productQueries.product(id).queryKey,
				old => old && applyUpdate(old)
			);

			return { previousLists, previousProduct };
		},

		onError: (_err, { id }, context) => {
			context?.previousLists.forEach(([queryKey, data]) => {
				qc.setQueryData(queryKey, data);
			});
			if (context?.previousProduct) {
				qc.setQueryData(productQueries.product(id).queryKey, context.previousProduct);
			}
		},

		onSettled: (_, __, { id }) => {
			qc.invalidateQueries({ queryKey: productQueries.lists().queryKey });
			qc.invalidateQueries({ queryKey: productQueries.product(id).queryKey });
			qc.invalidateQueries({ queryKey: imageQueries.byProduct(id).queryKey });
		}
	});
};
