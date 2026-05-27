import { type IUser } from '@/entities/user';

import { httpClient } from '@/shared/api';

export const getMe = () => httpClient.get<IUser>('/user/me').then(r => r.data);
