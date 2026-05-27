import { httpClient } from '@/shared/api';
import type { AttributeItem } from '@/shared/model';

export const getBrands = () =>
	httpClient.get<AttributeItem[]>('/brands/get_brands').then(r => r.data);
