import { type InputHTMLAttributes, forwardRef } from 'react';
import type { FieldError } from 'react-hook-form';

import type { VariantProps } from 'class-variance-authority';

import { Typography } from '../typography';

import { input } from './input.variants';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> &
	Omit<VariantProps<typeof input>, 'error'> & {
		className?: string;
		error?: FieldError;
	};

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, error, variant, ...props }, ref) => {
		return (
			<div className='flex w-full flex-col gap-1.5'>
				<input ref={ref} {...props} className={input({ variant, error: !!error, className })} />
				{error?.message && (
					<Typography variant='error' as='small'>
						{error.message}
					</Typography>
				)}
			</div>
		);
	}
);
