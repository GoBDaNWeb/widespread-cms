import { useQuery } from '@tanstack/react-query';

import { meQuery } from '@/entities/auth';

export const useMe = () => useQuery(meQuery);
