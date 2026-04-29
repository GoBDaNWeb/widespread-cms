import type { QueryClient } from '@tanstack/react-query';
import { redirect } from '@tanstack/react-router';

import { ROUTES } from '@/shared/config';

import { meQuery } from '../api';

export const requireGuest = async (qc: QueryClient) => {
	const user = await qc.ensureQueryData(meQuery);
	if (user) {
		throw redirect({ to: ROUTES.HOME });
	}
};

export const requireUser = async (qc: QueryClient) => {
	const user = await qc.ensureQueryData(meQuery);
	if (!user) {
		throw redirect({ to: ROUTES.AUTH });
	}
};
