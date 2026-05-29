import { useQuery } from '@tanstack/react-query';

import { imageQueries } from '@/entities/image';

export const useProductImages = (productId: number) => useQuery(imageQueries.byProduct(productId));
