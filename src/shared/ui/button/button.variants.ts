import { cva } from 'class-variance-authority';

export const button = cva(
	'inline-flex items-center justify-center rounded-lg font-medium transition-colors cursor-pointer',
	{
		variants: {
			variant: {
				primary: 'bg-accent text-white hover:bg-accent-hover',
				secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
				ghost: 'hover:bg-gray-100 text-gray-700',
				danger: 'bg-red-500 text-white hover:bg-red-600'
			},
			size: {
				sm: 'h-8 px-3 text-sm',
				md: 'h-10 px-4 text-base',
				lg: 'h-12 px-6 text-lg'
			},
			disabled: {
				true: 'opacity-50 pointer-events-none',
				false: ''
			}
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md'
		}
	}
);
