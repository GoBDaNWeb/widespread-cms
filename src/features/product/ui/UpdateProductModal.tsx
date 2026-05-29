import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import type { PendingImage } from '@/entities/image';

import { convertOptions } from '@/shared/lib';
import type { AttributeItem } from '@/shared/model';
import {
	Button,
	Modal,
	type ModalComponentProps,
	Spinner,
	Typography,
	useModalPayload
} from '@/shared/ui';

import { useProduct, useProductImages, useUpdateProduct } from '../api';
import { type CreateProductFormValues, createProductSchema } from '../lib';

import { ProductFormFields } from './ProductFormFields';

import { zodResolver } from '@hookform/resolvers/zod';

type UpdateProductModalPayload = {
	productId: number;
	brands: AttributeItem[];
	categories: AttributeItem[];
	sizes: AttributeItem[];
};

export const UpdateProductModal = ({ isOpen, close }: ModalComponentProps) => {
	const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
	const {
		productId,
		brands = [],
		categories = [],
		sizes = []
	} = useModalPayload<UpdateProductModalPayload>();

	const { data: productImages, refetch } = useProductImages(productId);
	const { data: product } = useProduct(productId);
	const { mutate: updateProduct, isPending } = useUpdateProduct();

	const convertedBrands = useMemo(() => convertOptions(brands), [brands]);
	const convertedSizes = useMemo(() => convertOptions(sizes), [sizes]);
	const convertedCategories = useMemo(() => convertOptions(categories), [categories]);

	const { control, reset, handleSubmit, setValue, watch } = useForm<CreateProductFormValues>({
		resolver: zodResolver(createProductSchema)
	});

	const productTitle = watch('title');
	const isResettingRef = useRef(false);

	useEffect(() => {
		if (product) {
			isResettingRef.current = true;
			reset({
				title: product.title,
				slug: product.slug,
				description: product.description,
				price: String(product.price),
				gender: product.gender,
				brand_id: product.brand_id,
				category_id: product.category_id,
				size_ids: product.sizes.map(size => size.id),
				is_published: product.is_published
			});
		}
	}, [product, reset]);

	useEffect(() => {
		if (!isOpen) return;
		refetch();
	}, [productId, isOpen, refetch]);

	useEffect(() => {
		if (!productImages) return;
		setPendingImages(
			productImages.map(image => ({
				alt: image.alt,
				localId: image.id,
				url: image.url,
				id: image.id
			}))
		);
	}, [productImages]);

	const onSubmit = (data: CreateProductFormValues) => {
		const brand = brands.find(b => b.id === data.brand_id);
		const category = categories.find(c => c.id === data.category_id);
		const selectedSizes = sizes.filter(s => data.size_ids?.includes(s.id));
		const originalImageIds = (productImages ?? []).map(image => image.id);

		updateProduct({
			id: productId,
			data,
			images: pendingImages,
			originalImageIds,
			brand,
			category,
			sizes: selectedSizes
		});
		close();
	};

	useEffect(() => {
		if (isResettingRef.current) {
			isResettingRef.current = false;
			return;
		}
		const slugValue = productTitle?.trim().toLowerCase().replace(/\s+/g, '-') ?? '';
		setValue('slug', slugValue);
	}, [productTitle, setValue]);

	if (!product)
		return (
			<Modal
				isOpen={isOpen}
				close={close}
				className='shadow-primary w-full max-w-200 rounded-2xl p-6'
			>
				<Typography variant='h1' as='h3' className='mb-6 text-center'>
					Update product
				</Typography>
				<div className='flex-center h-50'>
					<Spinner />
				</div>
			</Modal>
		);

	return (
		<Modal
			isOpen={isOpen}
			close={close}
			className='shadow-primary w-full max-w-200 rounded-2xl p-6'
		>
			<Typography variant='h1' as='h3' className='mb-6 text-center'>
				Update product
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ProductFormFields
					control={control}
					convertedBrands={convertedBrands}
					convertedCategories={convertedCategories}
					convertedSizes={convertedSizes}
					images={pendingImages}
					onImagesChange={setPendingImages}
				/>
				<div className='flex gap-4'>
					<Button variant='success' type='submit' className='w-full' disabled={isPending}>
						{isPending ? <Spinner /> : 'Update'}
					</Button>
					<Button onClick={close} className='w-full'>
						Close
					</Button>
				</div>
			</form>
		</Modal>
	);
};
