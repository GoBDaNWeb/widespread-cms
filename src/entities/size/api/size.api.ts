import { httpClient } from '@/shared/api';
import type { AttributeItem } from '@/shared/model';

export const getSizes = () => httpClient.get<AttributeItem[]>('/sizes/get_sizes').then(r => r.data);
