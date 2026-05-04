import { Outlet, createRoute } from '@tanstack/react-router';

import { Sidebar } from '@/widgets/sidebar';

import { rootRoute } from './root.route';

const AuthenticatedComponent = () => {
	return (
		<div className='grid grid-cols-[300px_1fr]'>
			<Sidebar />
			<Outlet />
		</div>
	);
};

export const authenticatedRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: '_authenticated',
	component: AuthenticatedComponent
});
