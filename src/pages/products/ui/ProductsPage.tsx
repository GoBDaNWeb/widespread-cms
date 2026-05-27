import { ResourceLayout } from '@/widgets/resource-layout';

import { useBrands } from '@/features/brand';
import { useCategories } from '@/features/category';
import { useSizes } from '@/features/size';

import { Button, useOpenModal } from '@/shared/ui';

import { ProductsTable } from './ProductsTable';

export const ProductsPage = () => {
	const openModal = useOpenModal();
	const { data: brands = [] } = useBrands();
	const { data: categories = [] } = useCategories();
	const { data: sizes = [] } = useSizes();

	const handleOpenCreateProductModal = () => {
		openModal('createProduct', { brands, categories, sizes });
	};

	return (
		<main className='p-5'>
			<ResourceLayout
				title='Products'
				actions={
					<Button size='sm' onClick={handleOpenCreateProductModal}>
						Add product
					</Button>
				}
			>
				<ProductsTable />
			</ResourceLayout>
		</main>
	);
};
