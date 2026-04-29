import type { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';

import { aboutRoute } from './about.route';
import { authRoute } from './auth.route';
import { homeRoute } from './home.route';
import { rootRoute } from './root.route';

const routeTree = rootRoute.addChildren([homeRoute, aboutRoute, authRoute]);

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
