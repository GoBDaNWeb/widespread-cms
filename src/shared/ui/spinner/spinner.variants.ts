import { cva } from 'class-variance-authority';

export const spinner = cva('text-foreground/50 fill-accent  animate-spin', {
	variants: {
		size: {
			sm: 'h-4 w-4',
			md: 'h-8 w-8'
		}
	},
	defaultVariants: {
		size: 'md'
	}
});
