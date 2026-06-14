import type { PendingImage } from './types';

export const makePendingImage = (
	overrides: Partial<PendingImage> & { url: string }
): PendingImage => ({
	alt: '',
	localId: overrides.id ?? overrides.url,
	...overrides
});
