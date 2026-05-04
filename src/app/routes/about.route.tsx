import { createRoute } from '@tanstack/react-router';

import { AboutPage } from '@/pages/about';

import { ROUTES } from '@/shared/config';

import { authenticatedRoute } from './_authenticated.route';

export const aboutRoute = createRoute({
	getParentRoute: () => authenticatedRoute,
	path: ROUTES.ABOUT,
	component: AboutPage
});
