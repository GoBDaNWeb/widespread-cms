import { createRoute } from '@tanstack/react-router';

import { ProductsPage } from '@/pages/products';

import { requireUser } from '@/features/auth';

import { ROUTES } from '@/shared/config';

import { authenticatedRoute } from './_authenticated.route';

export const productsRoute = createRoute({
	loader: ({ context: { queryClient } }) => requireUser(queryClient),
	getParentRoute: () => authenticatedRoute,
	path: ROUTES.PRODUCTS,
	component: ProductsPage
});
