import { httpClient } from '@/shared/api';
import type { AttributeItem } from '@/shared/model';

export const getCategories = () =>
	httpClient.get<AttributeItem[]>('/categories/get_categories').then(r => r.data);
