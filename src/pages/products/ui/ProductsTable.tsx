import { useEffect } from 'react';
import { BsGenderFemale, BsGenderMale, BsPencil, BsTrash } from 'react-icons/bs';

import { useProducts } from '@/features/products';

import { Badge, Button, Spinner, Typography, useOpenModal } from '@/shared/ui';

export const ProductsTable = () => {
	const { data: products, isPending, refetch } = useProducts();
	const openModal = useOpenModal();

	const handleOpenDeleteProductModal = (productId: number) => {
		openModal('deleteProduct', { productId });
	};

	useEffect(() => {
		refetch();
	}, []);

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
		<div className='bg-surface shadow-primary flex-1 overflow-hidden rounded-2xl'>
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
														? `http://127.0.0.1:8000/media/${product.images[0].url}`
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
									<div className='flex gap-2'>
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
											onClick={() => {}}
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
		</div>
	);
};
