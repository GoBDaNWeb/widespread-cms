import { httpClient } from '@/shared/api';

import type { IImage, IImageCreate } from '../model/types';

export const createImage = (data: IImageCreate) =>
	httpClient.post<IImage>('/images/create_image', data).then(r => r.data);

export const deleteImage = (imageId: number) =>
	httpClient.delete(`/images/delete_image/${imageId}`);

export const getImagesByProduct = (productId: number) =>
	httpClient.get<IImage[]>(`/images/get_images_by_product/${productId}`).then(r => r.data);
