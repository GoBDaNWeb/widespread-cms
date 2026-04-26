import { RouterProvider } from '@tanstack/react-router';

import { router } from '@/app/routes';

export const Provider = () => {
	return <RouterProvider router={router} />;
};
