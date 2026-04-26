import { createRoute } from '@tanstack/react-router';

import { HomePage } from '@/pages/home';

import { ROUTES } from '@/shared/config';

import { rootRoute } from './root.route';

export const homeRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: ROUTES.HOME,
	component: HomePage
});
