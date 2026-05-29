export interface IImage {
	id: number;
	product_id: number;
	url: string;
	alt: string;
	order: number;
}

export interface IImageCreate {
	product_id: number;
	url: string;
	alt: string;
	order: number;
}

export type PendingImage = {
	url: string;
	alt: string;
	localId: string | number;
	id?: number;
};
