import { useEffect, useMemo, useState } from 'react';
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

import { useCreateProduct } from '../api';
import { type CreateProductFormValues, createProductSchema } from '../lib';

import { ProductFormFields } from './ProductFormFields';

import { zodResolver } from '@hookform/resolvers/zod';

type CreateProductModalPayload = {
	brands: AttributeItem[];
	categories: AttributeItem[];
	sizes: AttributeItem[];
};

export const CreateProductModal = ({ isOpen, close }: ModalComponentProps) => {
	const { brands = [], sizes = [], categories = [] } = useModalPayload<CreateProductModalPayload>();

	const convertedBrands = useMemo(() => convertOptions(brands), [brands]);
	const convertedSizes = useMemo(() => convertOptions(sizes), [sizes]);
	const convertedCategories = useMemo(() => convertOptions(categories), [categories]);

	const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

	const { handleSubmit, control, watch, setValue, reset } = useForm<CreateProductFormValues>({
		resolver: zodResolver(createProductSchema),
		defaultValues: { gender: 'male', is_published: false }
	});

	const { mutateAsync: createProduct, isPending } = useCreateProduct();

	const productTitle = watch('title');

	const onSubmit = async (data: CreateProductFormValues) => {
		await createProduct({
			product: {
				title: data.title,
				slug: data.slug,
				description: data.description,
				price: Number(data.price),
				gender: data.gender,
				brand_id: data.brand_id,
				category_id: data.category_id,
				size_ids: data.size_ids,
				is_published: data.is_published,
				is_archived: false
			},
			images: pendingImages
		});
		handleCloseModal();
	};

	const handleCloseModal = () => {
		close();
		setTimeout(() => {
			reset();
			setPendingImages([]);
		}, 300);
	};

	useEffect(() => {
		const slugValue = productTitle?.trim().toLowerCase().replace(/\s+/g, '-') ?? '';
		setValue('slug', slugValue ?? '');
	}, [productTitle, setValue]);

	return (
		<Modal
			isOpen={isOpen}
			close={close}
			className='shadow-primary w-full max-w-200 rounded-2xl p-6'
		>
			<Typography variant='h1' as='h3' className='mb-6 text-center'>
				Create product
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
						{isPending ? <Spinner /> : 'Create'}
					</Button>
					<Button onClick={handleCloseModal} className='w-full' disabled={isPending}>
						Close
					</Button>
				</div>
			</form>
		</Modal>
	);
};
