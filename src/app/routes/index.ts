import { createRouter } from '@tanstack/react-router';

import { aboutRoute } from './about.route';
import { homeRoute } from './home.route';
import { rootRoute } from './root.route';

const routeTree = rootRoute.addChildren([homeRoute, aboutRoute]);

export const router = createRouter({
	routeTree,
	defaultPreload: 'intent'
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
