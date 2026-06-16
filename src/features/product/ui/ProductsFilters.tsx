import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { useBrands } from '@/features/brand';
import { useCategories } from '@/features/category';
import { useSizes } from '@/features/size';

import type { IProductsSearch } from '@/entities/product';

import { PAGE_SIZES } from '@/shared/config';
import { convertOptions, toBoolean, useDebouncedValue } from '@/shared/lib';
import { Button, Input, type Option, Selector, Typography } from '@/shared/ui';

import {
	FILTER_BOOL_OPTIONS,
	FILTER_GENDER_OPTIONS,
	FILTER_ORDER_OPTIONS,
	FILTER_SORT_OPTIONS
} from '../config';

const ALL_ID = 0;

export const ProductsFilters = () => {
	const search = useSearch({ strict: false }) as IProductsSearch;
	const navigate = useNavigate();

	const { data: brands = [] } = useBrands();
	const { data: categories = [] } = useCategories();
	const { data: sizes = [] } = useSizes();

	const [text, setText] = useState({
		search: search.search ?? '',
		min_price: search.min_price?.toString() ?? '',
		max_price: search.max_price?.toString() ?? ''
	});

	const update = (patch: Partial<IProductsSearch>) => {
		navigate({ to: '.', search: prev => ({ ...prev, ...patch, page: 1 }) });
	};

	const debouncedText = useDebouncedValue(text, 400);

	useEffect(() => {
		const nextSearch = debouncedText.search.trim() || undefined;
		const nextMin = debouncedText.min_price ? Number(debouncedText.min_price) : undefined;
		const nextMax = debouncedText.max_price ? Number(debouncedText.max_price) : undefined;
		if (
			nextSearch === search.search &&
			nextMin === search.min_price &&
			nextMax === search.max_price
		) {
			return;
		}

		update({ search: nextSearch, min_price: nextMin, max_price: nextMax });
	}, [debouncedText]);

	const handleReset = () => {
		setText({ search: '', min_price: '', max_price: '' });
		navigate({ to: '.', search: { page: 1, page_size: 10 } });
	};

	const categoryOptions: Option<number>[] = [
		{ label: 'All categories', value: ALL_ID },
		...convertOptions(categories)
	];
	const brandOptions: Option<number>[] = [
		{ label: 'All brands', value: ALL_ID },
		...convertOptions(brands)
	];
	const sizeOptions = convertOptions(sizes);

	const pageCountValue = PAGE_SIZES.find(o => o.value === search.page_size);
	const categoryValue = categoryOptions.find(o => o.value === (search.category_id ?? ALL_ID));
	const brandValue = brandOptions.find(o => o.value === (search.brand_id ?? ALL_ID));
	const genderValue = FILTER_GENDER_OPTIONS.find(o => o.value === (search.gender ?? ''));
	const publishedValue = FILTER_BOOL_OPTIONS.find(
		o => o.value === String(search.is_published ?? '')
	);
	const sortValue = FILTER_SORT_OPTIONS.find(o => o.value === search.sort_by);
	const orderValue = FILTER_ORDER_OPTIONS.find(o => o.value === search.order);
	const sizeValue = sizeOptions.filter(o => search.size_ids?.includes(o.value));

	const hasActiveFilters = [
		search.search,
		search.category_id,
		search.brand_id,
		search.gender,
		search.is_published,
		search.is_archived,
		search.min_price,
		search.max_price,
		search.size_ids?.length,
		search.sort_by,
		search.order
	].some(value => value !== undefined && value !== '');

	return (
		<div className='flex flex-col gap-5'>
			<div className='flex items-center justify-between'>
				<Typography variant='h3' as='h3'>
					Filters
				</Typography>
				{hasActiveFilters && (
					<Button size='sm' variant='secondary' onClick={handleReset}>
						Reset
					</Button>
				)}
			</div>

			<div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
				<div className='col-span-2 lg:col-span-4'>
					<Input
						name='search'
						hint='Search'
						placeholder='Search by title or description'
						value={text.search}
						onChange={value => setText(prev => ({ ...prev, search: value }))}
					/>
				</div>

				<Selector
					name='category_id'
					hint='Category'
					options={categoryOptions}
					value={categoryValue}
					onChange={option => {
						const value = (option as Option<number> | null)?.value;
						update({ category_id: value ? value : undefined });
					}}
				/>

				<Selector
					name='brand_id'
					hint='Brand'
					options={brandOptions}
					value={brandValue}
					onChange={option => {
						const value = (option as Option<number> | null)?.value;
						update({ brand_id: value ? value : undefined });
					}}
				/>

				<Selector
					name='gender'
					hint='Gender'
					options={FILTER_GENDER_OPTIONS}
					value={genderValue}
					onChange={option => {
						const value = (option as Option<string> | null)?.value;
						update({ gender: value === 'male' || value === 'female' ? value : undefined });
					}}
				/>

				<Selector
					name='size_ids'
					hint='Sizes'
					isMulti
					placeholder='Any size'
					options={sizeOptions}
					value={sizeValue}
					onChange={option => {
						const ids = (option as Option<number>[]).map(o => o.value);
						update({ size_ids: ids.length ? ids : undefined });
					}}
				/>

				<Selector
					name='is_published'
					hint='Published'
					options={FILTER_BOOL_OPTIONS}
					value={publishedValue}
					onChange={option =>
						update({ is_published: toBoolean((option as Option<string>)?.value) })
					}
				/>

				<Input
					name='min_price'
					hint='Min price'
					placeholder='0'
					mask={Number}
					value={text.min_price}
					onChange={value => setText(prev => ({ ...prev, min_price: value }))}
				/>

				<Input
					name='max_price'
					hint='Max price'
					mask={Number}
					placeholder='∞'
					value={text.max_price}
					onChange={value => setText(prev => ({ ...prev, max_price: value }))}
				/>

				<Selector
					name='sort_by'
					hint='Sort by'
					placeholder='Default'
					options={FILTER_SORT_OPTIONS}
					value={sortValue}
					onChange={option => {
						const value = (option as Option<string> | null)?.value;
						update({
							sort_by: value === 'id' || value === 'title' || value === 'price' ? value : undefined
						});
					}}
				/>

				<Selector
					name='order'
					hint='Order'
					placeholder='Default'
					options={FILTER_ORDER_OPTIONS}
					value={orderValue}
					onChange={option => {
						const value = (option as Option<string> | null)?.value;
						update({ order: value === 'asc' || value === 'desc' ? value : undefined });
					}}
				/>

				<Selector
					name='page_size'
					hint='Items per page'
					options={PAGE_SIZES}
					value={pageCountValue}
					onChange={option => {
						const value = (option as Option<number> | null)?.value;
						if (value) update({ page_size: value });
					}}
				/>
			</div>
		</div>
	);
};
