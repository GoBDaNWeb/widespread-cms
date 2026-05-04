import type { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';

import { authenticatedRoute } from './_authenticated.route';
import { aboutRoute } from './about.route';
import { authRoute } from './auth.route';
import { dashboardRoute } from './dashboard.route';
import { homeRoute } from './home.route';
import { rootRoute } from './root.route';
import { usersRoute } from './users.route';

const routeTree = rootRoute.addChildren([
	authenticatedRoute.addChildren([homeRoute, aboutRoute, dashboardRoute, usersRoute]),
	authRoute
]);

export interface RouterContext {
	queryClient: QueryClient;
}

export const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
	context: {
		queryClient: undefined!
	}
});
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
