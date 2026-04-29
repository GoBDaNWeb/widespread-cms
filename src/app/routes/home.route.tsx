import { createRoute } from '@tanstack/react-router';

import { HomePage } from '@/pages/home';

import { requireUser } from '@/features/auth';

import { ROUTES } from '@/shared/config';

import { rootRoute } from './root.route';

export const homeRoute = createRoute({
	loader: ({ context: { queryClient } }) => requireUser(queryClient),
	getParentRoute: () => rootRoute,
	path: ROUTES.HOME,
	component: HomePage
});
