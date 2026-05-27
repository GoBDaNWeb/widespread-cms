import { useQuery } from '@tanstack/react-query';

import { sizeQueries } from '@/entities/size';

export const useSizes = () => useQuery(sizeQueries.list());
