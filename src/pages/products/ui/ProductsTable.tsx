import { useNavigate, useSearch } from '@tanstack/react-router';
import { BsGenderFemale, BsGenderMale, BsPencil, BsTrash } from 'react-icons/bs';

import { useBrands } from '@/features/brand';
import { useCategories } from '@/features/category';
import { useProducts } from '@/features/product';
import { useSizes } from '@/features/size';

import { API_URL } from '@/shared/config';
import { Badge, Button, Pagination, Spinner, Typography, useOpenModal } from '@/shared/ui';

const PAGE_SIZE = 10;

export const ProductsTable = () => {
	const { page = 1 } = useSearch({ strict: false }) as { page?: number };
	const navigate = useNavigate();
	const { data: products, isPending, isFetching } = useProducts(PAGE_SIZE, page);
	const openModal = useOpenModal();

	const { data: brands = [] } = useBrands();
	const { data: categories = [] } = useCategories();
	const { data: sizes = [] } = useSizes();

	const handlePageChange = (newPage: number) => {
		navigate({ to: '.', search: { page: newPage } as never });
	};

	const handleOpenDeleteProductModal = (productId: number) => {
		openModal('deleteProduct', { productId });
	};

	const handleOpenUpdateProductModal = (productId: number) => {
		openModal('updateProduct', { productId, brands, categories, sizes });
	};

	if (isPending) {
		return (
			<div className='bg-surface shadow-primary flex-center flex flex-1 rounded-2xl p-5'>
				<div className='flex gap-4'>
					<Spinner />

					<Typography variant='body'>Loading</Typography>
				</div>
			</div>
		);
	}
	if (!products?.items.length) {
		return (
			<div className='bg-surface shadow-primary flex-center flex h-full flex-1 rounded-2xl p-5'>
				<Typography variant='body'>No products found.</Typography>
			</div>
		);
	}

	return (
		<div className='bg-surface shadow-primary relative flex flex-1 flex-col overflow-hidden rounded-2xl'>
			{isFetching && (
				<div className='flex-center absolute inset-0 z-10 m-auto flex backdrop-blur-sm'>
					<Spinner />
				</div>
			)}
			<table className='w-full table-fixed text-left'>
				<thead>
					<tr className='border-b border-gray-100'>
						<th className='typography-caption w-16 px-5 py-3 font-medium text-gray-500'>ID</th>
						<th className='typography-caption w-50 px-5 py-3 font-medium text-gray-500'>Name</th>
						<th className='typography-caption w-22 px-5 py-3 font-medium text-gray-500'>Images</th>
						<th className='typography-caption w-80 px-5 py-3 font-medium text-gray-500'>
							Description
						</th>
						<th className='typography-caption w-30 px-5 py-3 font-medium text-gray-500'>Price</th>
						<th className='typography-caption w-30 px-5 py-3 font-medium text-gray-500'>Brand</th>
						<th className='typography-caption w-30 px-5 py-3 font-medium text-gray-500'>
							Category
						</th>
						<th className='typography-caption w-30 px-5 py-3 font-medium text-gray-500'>Gender</th>
						<th className='typography-caption w-30 px-5 py-3 font-medium text-gray-500'>
							Published
						</th>
						<th className='typography-caption px-5 py-3 font-medium text-gray-500'>Sizes</th>
						<th className='px-5 py-3' />
					</tr>
				</thead>
				<tbody>
					{products.items.map(product => {
						const isMale = product.gender === 'male';
						const GenderIcon = isMale ? BsGenderMale : BsGenderFemale;

						return (
							<tr key={product.id} className='border-b border-gray-100 last:border-0'>
								<td className='typography-body-md px-5 py-3'>{product.id}</td>
								<td className='typography-body-md px-5 py-3'>{product.title}</td>
								<td className='typography-body-md px-5 py-3'>
									{product.images && (
										<div className='bg-gray h-12 w-12 overflow-hidden rounded-sm'>
											<img
												src={
													product.images?.length
														? `${API_URL}${product.images[0].url}`
														: 'nophoto.png'
												}
												alt='product image'
												className='h-full w-full object-cover'
											/>
										</div>
									)}
								</td>
								<td className='typography-body-md px-5 py-3 text-gray-500'>
									{product.description}
								</td>
								<td className='typography-body-md px-5 py-3'>
									${Number(product.price).toFixed(2)}
								</td>
								<td className='typography-body-md px-5 py-3'>{product.brand?.name ?? '-'}</td>
								<td className='typography-body-md px-5 py-3'>{product.category?.name ?? '-'}</td>
								<td className='typography-body-md px-5 py-3'>
									<div
										className={`${isMale ? 'text-accent' : 'text-error'} flex-center flex gap-2`}
									>
										<GenderIcon />
										{product.gender}
									</div>
								</td>
								<td className='typography-body-md px-5 py-3'>{product.is_published ? 'Y' : 'N'}</td>
								<td className='typography-body-md px-5 py-3'>
									<div className='flex flex-wrap gap-2'>
										{product.sizes.map(size => (
											<Badge key={size.id}>{size.name}</Badge>
										))}
									</div>
								</td>
								<td className='px-5 py-3'>
									<div className='flex items-center justify-end gap-2'>
										<Button
											className='hover:text-accent-hover text-yellow-300'
											variant='ghost'
											size='md'
											onClick={() => handleOpenUpdateProductModal(product.id)}
										>
											<BsPencil />
										</Button>
										<Button
											variant='ghost'
											size='md'
											className='text-error hover:text-error-hover'
											onClick={() => handleOpenDeleteProductModal(product.id)}
										>
											<BsTrash />
										</Button>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<Pagination
				page={products.page}
				pages={products.pages}
				onChange={handlePageChange}
				className='mt-auto'
			/>
		</div>
	);
};
