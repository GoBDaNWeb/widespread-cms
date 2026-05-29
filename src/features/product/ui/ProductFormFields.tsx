import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import type { MultiValue, SingleValue } from 'react-select';

import type { PendingImage } from '@/entities/image';

import type { Option } from '@/shared/ui';
import { RHFCheckbox, RHFInput, Selector } from '@/shared/ui';

import { genderOptions } from '../config';
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
						onChange={option => onChange((option as SingleValue<Option<number>>)?.value)}
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
			<ProductImageUpload images={images} onChange={onImagesChange} />
		</div>
	);
};
