import { cva } from 'class-variance-authority';

export const input = cva('outline-none border', {
	variants: {
		variant: {
			primary: 'bg-background text-text shadow-primary h-12 w-full rounded-lg px-4'
		},
		error: {
			true: 'border-error',
			false: 'border-transparent'
		}
	},
	defaultVariants: {
		variant: 'primary'
	}
});
