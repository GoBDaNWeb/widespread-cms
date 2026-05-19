import { useQuery } from '@tanstack/react-query';

import { productsQuery } from '@/entities/product';

export const useProducts = () => useQuery(productsQuery());
