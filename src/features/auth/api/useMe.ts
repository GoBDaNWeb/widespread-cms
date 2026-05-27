import { useQuery } from '@tanstack/react-query';

import { authQueries } from '@/entities/auth';

export const useMe = () => useQuery(authQueries.me());
