import type { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { ModalManager } from '../providers/ModalManager';

type RouterContext = {
	queryClient: QueryClient;
};

export const rootRoute = createRootRouteWithContext<RouterContext>()({
	component: () => (
		<>
			<Outlet />
			<ModalManager />
			<TanStackRouterDevtools position='top-right' />
		</>
	)
});
