import { cva } from 'class-variance-authority';

export const badge = cva('w-fit rounded-md px-4', {
	variants: {
		variant: {
			primary: 'bg-accent text-white text-sm rounded-2'
		}
	},
	defaultVariants: {
		variant: 'primary'
	}
});
