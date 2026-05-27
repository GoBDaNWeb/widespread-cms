import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { MultiValue, SingleValue } from 'react-select';

import type { PendingImage } from '@/entities/image';

import { convertOptions } from '@/shared/lib';
import type { AttributeItem } from '@/shared/model';
import {
	Button,
	Modal,
	type ModalComponentProps,
	type Option,
	RHFCheckbox,
	RHFInput,
	Selector,
	Spinner,
	Typography,
	useModalPayload
} from '@/shared/ui';

import { useCreateProduct } from '../api';
import { genderOptions } from '../config';
import { type CreateProductFormValues, createProductSchema } from '../lib';

import { ProductImageUpload } from './ProductImageUpload';

import { zodResolver } from '@hookform/resolvers/zod';

type CreateProductModalPayload = {
	brands: AttributeItem[];
	categories: AttributeItem[];
	sizes: AttributeItem[];
};

export const CreateProductModal = ({ isOpen, close }: ModalComponentProps) => {
	const { brands, sizes, categories } = useModalPayload<CreateProductModalPayload>();

	const convertedBrands = useMemo(() => convertOptions(brands), [brands]);
	const convertedSizes = useMemo(() => convertOptions(sizes), [sizes]);
	const convertedCategories = useMemo(() => convertOptions(categories), [categories]);

	const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

	const { handleSubmit, control, watch, setValue, reset } = useForm<CreateProductFormValues>({
		resolver: zodResolver(createProductSchema),
		defaultValues: { gender: 'male' }
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
		const slugValue = productTitle?.toLowerCase().replace(/\s+(?=\S)/g, '-');
		setValue('slug', slugValue ?? '');
	}, [productTitle]);

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
				<div className='mb-10 flex flex-col gap-5'>
					<RHFInput name='title' placeholder='Product title *' control={control} />
					<RHFInput name='slug' placeholder='Product slug *' control={control} readOnly />
					<RHFInput name='description' placeholder='Product description *' control={control} />
					<RHFInput name='price' placeholder='Product price *' control={control} mask={Number} />
					<Controller
						name='gender'
						control={control}
						render={({ field: { value, onChange } }) => (
							<Selector
								name='gender'
								placeholder='Product gender'
								options={genderOptions}
								value={genderOptions.find(option => option.value === value)}
								onChange={option => onChange((option as SingleValue<Option>)?.value)}
							/>
						)}
					/>
					<Controller
						name='brand_id'
						control={control}
						render={({ field: { value, onChange } }) => (
							<Selector
								name='brand_id'
								placeholder='Product brand'
								options={convertedBrands}
								value={convertedBrands.find(option => option.value === value)}
								onChange={option => onChange((option as SingleValue<Option>)?.value)}
							/>
						)}
					/>
					<Controller
						name='category_id'
						control={control}
						render={({ field }) => (
							<Selector
								placeholder='Product category'
								name='category_id'
								options={convertedCategories}
								value={convertedCategories.find(option => option.value === field.value)}
								onChange={option => field.onChange((option as SingleValue<Option<number>>)?.value)}
							/>
						)}
					/>
					<Controller
						name='size_ids'
						control={control}
						render={({ field: { value, onChange } }) => (
							<Selector
								name='size_ids'
								placeholder='Product sizes'
								isMulti
								options={convertedSizes}
								value={convertedSizes.filter(option => value?.includes(option.value))}
								onChange={option =>
									onChange((option as MultiValue<Option<number>>).map(o => o.value))
								}
							/>
						)}
					/>
					<RHFCheckbox name='is_published' control={control} label='Publish product' />
					<ProductImageUpload images={pendingImages} onChange={setPendingImages} />
				</div>
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
