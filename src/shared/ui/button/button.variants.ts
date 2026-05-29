import { cva } from 'class-variance-authority';

export const button = cva(
	'inline-flex items-center justify-center rounded-lg font-medium cursor-pointer trs disabled:opacity-50 disabled:pointer-events-none',
	{
		variants: {
			variant: {
				primary: 'bg-accent text-white hover:bg-accent-hover',
				secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
				success: 'bg-success text-white hover:bg-success-hover',
				ghost: 'hover:bg-gray-100 text-gray-700',
				danger: 'bg-red-500 text-white hover:bg-red-600',
				unstyled: 'bg-none gap-1.5'
			},
			size: {
				sm: 'h-8 px-3 text-sm',
				md: 'h-10 px-4 text-base',
				lg: 'h-12 px-6 text-lg',
				unstyled: 'h-fit px-0 text-base'
			}
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md'
		}
	}
);
