import { createRoute } from '@tanstack/react-router';

import { AuthPage } from '@/pages/auth';

import { requireGuest } from '@/features/auth';

import { ROUTES } from '@/shared/config';

import { rootRoute } from './root.route';

export const authRoute = createRoute({
	loader: ({ context: { queryClient } }) => requireGuest(queryClient),
	getParentRoute: () => rootRoute,
	path: ROUTES.AUTH,
	component: AuthPage
});
