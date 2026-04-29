import { RouterProvider } from '@tanstack/react-router';

import { router } from '@/app/routes';

import { queryClient } from '@/shared/api';

import { QueryProvider } from './QueryProvider';

export const Provider = () => (
	<QueryProvider>
		<RouterProvider router={router} context={{ queryClient }} />
	</QueryProvider>
);
