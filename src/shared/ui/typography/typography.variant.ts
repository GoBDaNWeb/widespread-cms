import { cva } from 'class-variance-authority';

export const typography = cva('', {
	variants: {
		variant: {
			h1: 'text-4xl font-bold leading-tight',
			h2: 'text-2xl font-semibold',
			body: 'text-base leading-relaxed text-text-gray',
			caption: 'text-sm text-text-gray',
			small: 'text-error text-xs'
		}
	},
	defaultVariants: {
		variant: 'body'
	}
});
