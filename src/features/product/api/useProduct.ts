import { useQuery } from '@tanstack/react-query';

import { productQueries } from '@/entities/product';

export const useProduct = (productId: number) => useQuery(productQueries.product(productId));
