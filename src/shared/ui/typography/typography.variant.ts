import { cva } from 'class-variance-authority';

export const typography = cva('', {
	variants: {
		variant: {
			h1: 'typography-h1',
			h2: 'typography-h2',
			body: 'typography-body',
			caption: 'typography-caption',
			error: 'typography-error'
		}
	},
	defaultVariants: {
		variant: 'body'
	}
});
