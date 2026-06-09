import { cva } from 'class-variance-authority';

export const badge = cva('w-fit rounded-md px-4 text-sm rounded-2', {
	variants: {
		variant: {
			primary: 'bg-accent text-white',
			error: 'bg-error text-white',
			success: 'bg-success text-white'
		}
	},
	defaultVariants: {
		variant: 'primary'
	}
});
