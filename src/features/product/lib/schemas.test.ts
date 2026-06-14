import { describe, expect, it } from 'vitest';

import { createProductSchema } from './schemas';

const validValues = {
	title: 'Shoes',
	slug: 'shoes',
	description: 'Nice shoes',
	price: '100',
	gender: 'male' as const,
	brand_id: 1,
	category_id: 2,
	size_ids: [1, 2],
	is_published: true
};

describe('createProductSchema', () => {
	it('accepts a fully valid payload', () => {
		const result = createProductSchema.safeParse(validValues);
		expect(result.success).toBe(true);
	});

	it('accepts an empty size_ids array', () => {
		const result = createProductSchema.safeParse({ ...validValues, size_ids: [] });
		expect(result.success).toBe(true);
	});

	it.each(['title', 'slug', 'description'])('rejects empty %s', field => {
		const result = createProductSchema.safeParse({ ...validValues, [field]: '' });
		expect(result.success).toBe(false);
	});

	it('rejects an invalid gender', () => {
		const result = createProductSchema.safeParse({ ...validValues, gender: 'other' });
		expect(result.success).toBe(false);
	});

	it.each([0, -1])('rejects non-positive brand_id %s', brand_id => {
		const result = createProductSchema.safeParse({ ...validValues, brand_id });
		expect(result.success).toBe(false);
	});

	it.each([0, -1])('rejects non-positive category_id %s', category_id => {
		const result = createProductSchema.safeParse({ ...validValues, category_id });
		expect(result.success).toBe(false);
	});

	it('surfaces the "Title is required" message for a missing title', () => {
		const result = createProductSchema.safeParse({ ...validValues, title: '' });
		expect(result.success).toBe(false);
		if (!result.success) {
			const titleIssue = result.error.issues.find(i => i.path[0] === 'title');
			expect(titleIssue?.message).toBe('Title is required');
		}
	});
});
