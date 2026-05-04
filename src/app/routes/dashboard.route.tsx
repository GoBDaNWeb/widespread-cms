import { createRoute } from '@tanstack/react-router';

import { DashboardPage } from '@/pages/dashboard';

import { requireUser } from '@/features/auth';

import { ROUTES } from '@/shared/config';

import { authenticatedRoute } from './_authenticated.route';

export const dashboardRoute = createRoute({
	loader: ({ context: { queryClient } }) => requireUser(queryClient),
	getParentRoute: () => authenticatedRoute,
	path: ROUTES.DASHBOARD,
	component: DashboardPage
});
