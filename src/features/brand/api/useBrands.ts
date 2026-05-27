import { useQuery } from '@tanstack/react-query';

import { brandQueries } from '@/entities/brand';

export const useBrands = () => useQuery(brandQueries.list());
