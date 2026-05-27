import { useQuery } from '@tanstack/react-query';

import { productQueries } from '@/entities/product';

export const useProducts = () => useQuery(productQueries.list());
