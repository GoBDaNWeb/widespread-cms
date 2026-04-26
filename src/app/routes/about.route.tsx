import { createRoute } from '@tanstack/react-router';

import { AboutPage } from '@/pages/about';

import { ROUTES } from '@/shared/config';

import { rootRoute } from './root.route';

export const aboutRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: ROUTES.ABOUT,
	component: AboutPage
});
