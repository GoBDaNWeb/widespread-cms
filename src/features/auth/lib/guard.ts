import type { QueryClient } from '@tanstack/react-query';
import { redirect } from '@tanstack/react-router';

import { meQuery } from '@/entities/auth';

import { ROUTES } from '@/shared/config';

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
