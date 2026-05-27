import { useQuery } from '@tanstack/react-query';

import { categoryQueries } from '@/entities/category';

export const useCategories = () => useQuery(categoryQueries.list());
