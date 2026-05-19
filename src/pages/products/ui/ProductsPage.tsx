import { ResourceLayout } from '@/widgets/resource-layout';

import { Button } from '@/shared/ui';

import { ProductsTable } from './ProductsTable';

export const ProductsPage = () => {
	return (
		<main className='p-5'>
			<ResourceLayout title='Products' actions={<Button size='sm'>Add product</Button>}>
				<ProductsTable />
			</ResourceLayout>
		</main>
	);
};
