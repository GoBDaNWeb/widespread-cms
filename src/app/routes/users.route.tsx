import { createRoute } from '@tanstack/react-router';

import { UsersPage } from '@/pages/users';

import { requireUser } from '@/features/auth';

import { ROUTES } from '@/shared/config';

import { authenticatedRoute } from './_authenticated.route';

export const usersRoute = createRoute({
	loader: ({ context: { queryClient } }) => requireUser(queryClient),
	getParentRoute: () => authenticatedRoute,
	path: ROUTES.USERS,
	component: UsersPage
});
