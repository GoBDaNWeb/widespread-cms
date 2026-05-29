import { z } from 'zod';

export const createProductSchema = z.object({
	title: z.string({ error: 'Title is required' }).min(1, 'Title is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.string({ error: 'Description is required' }).min(1, 'Description is required'),
	price: z.string({ error: 'Price is required' }),
	gender: z.enum(['male', 'female']),
	brand_id: z.number({ error: 'Brand is required' }).positive('Brand is required'),
	category_id: z.number({ error: 'Category is required' }).positive('Category is required'),
	size_ids: z.array(z.number()).min(1, 'At least one size is required'),
	is_published: z.boolean()
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
