import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import type { MultiValue, SingleValue } from 'react-select';

import type { PendingImage } from '@/entities/image';

import type { Option } from '@/shared/ui';
import { RHFCheckbox, RHFInput, RHFRichTextEditor, Selector } from '@/shared/ui';

import { GENDER_OPTIONS } from '../config';
import type { CreateProductFormValues } from '../lib';

import { ProductImageUpload } from './ProductImageUpload';

type Props = {
	control: Control<CreateProductFormValues>;
	convertedBrands: Option<number>[];
	convertedCategories: Option<number>[];
	convertedSizes: Option<number>[];
	images: PendingImage[];
	onImagesChange: (images: PendingImage[]) => void;
};

export const ProductFormFields = ({
	control,
	convertedBrands,
	convertedCategories,
	convertedSizes,
	images,
	onImagesChange
}: Props) => {
	return (
		<div className='mb-10 flex flex-col gap-5'>
			<RHFInput name='title' hint='Product title' placeholder='Enter title' control={control} />
			<RHFInput name='slug' hint='Product slug' control={control} readOnly />
			<RHFInput
				name='price'
				hint='Product price'
				placeholder='Enter price'
				control={control}
				mask={Number}
			/>
			<Controller
				name='gender'
				control={control}
				render={({ field: { value, onChange }, fieldState }) => (
					<Selector
						name='gender'
						hint='Product gender'
						placeholder='Select gender'
						options={GENDER_OPTIONS}
						value={GENDER_OPTIONS.find(option => option.value === value)}
						onChange={option => onChange((option as SingleValue<Option>)?.value)}
						error={fieldState.error}
					/>
				)}
			/>
			<Controller
				name='brand_id'
				control={control}
				render={({ field: { value, onChange }, fieldState }) => (
					<Selector
						name='brand_id'
						hint='Product brand'
						placeholder='Select brand'
						options={convertedBrands}
						value={convertedBrands.find(option => option.value === value)}
						onChange={option => onChange((option as SingleValue<Option<number>>)?.value)}
						error={fieldState.error}
					/>
				)}
			/>
			<Controller
				name='category_id'
				control={control}
				render={({ field, fieldState }) => (
					<Selector
						name='category_id'
						hint='Product category'
						placeholder='Select category'
						options={convertedCategories}
						value={convertedCategories.find(option => option.value === field.value)}
						onChange={option => field.onChange((option as SingleValue<Option<number>>)?.value)}
						error={fieldState.error}
					/>
				)}
			/>
			<Controller
				name='size_ids'
				control={control}
				render={({ field: { value, onChange }, fieldState }) => (
					<Selector
						name='size_ids'
						hint='Product sizes'
						placeholder='Select sizes'
						isMulti
						options={convertedSizes}
						value={convertedSizes.filter(option => value?.includes(option.value))}
						onChange={option => onChange((option as MultiValue<Option<number>>).map(o => o.value))}
						error={fieldState.error}
					/>
				)}
			/>
			<RHFRichTextEditor name='description' hint='Product description' control={control} />

			<RHFCheckbox name='is_published' control={control} label='Publish product' />
			<ProductImageUpload images={images} onChange={onImagesChange} />
		</div>
	);
};
