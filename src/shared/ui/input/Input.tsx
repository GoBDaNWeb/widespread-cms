import { type InputHTMLAttributes, forwardRef } from 'react';
import type { FieldError } from 'react-hook-form';
import { IMaskInput } from 'react-imask';

import type { VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

import { Typography } from '../typography';

import { input } from './input.variants';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> &
	Omit<VariantProps<typeof input>, 'error'> & {
		className?: string;
		error?: FieldError;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		mask?: any;
		unmask?: boolean | 'typed';
		onAccept?: (value: string) => void;
	};

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			error,
			variant,
			mask,
			unmask,
			onAccept,
			placeholder,
			value,
			name,
			id,
			disabled,
			autoComplete,
			onBlur,
			readOnly,
			required,
			type,
			...props
		},
		ref
	) => {
		const inputClass = twMerge(input({ variant, error: !!error }), className);

		return (
			<div className='flex w-full flex-col gap-1.5'>
				{mask ? (
					<IMaskInput
						mask={mask}
						unmask={unmask}
						onAccept={onAccept}
						inputRef={ref}
						className={inputClass}
						placeholder={placeholder}
						value={value as string}
						name={name}
						id={id}
						disabled={disabled}
						autoComplete={autoComplete}
						onBlur={onBlur}
						readOnly={readOnly}
						required={required}
					/>
				) : (
					<input
						ref={ref}
						className={inputClass}
						placeholder={placeholder}
						value={value}
						name={name}
						id={id}
						disabled={disabled}
						autoComplete={autoComplete}
						onBlur={onBlur}
						readOnly={readOnly}
						required={required}
						type={type}
						{...props}
					/>
				)}
				{error?.message && (
					<Typography variant='error' as='small'>
						{error.message}
					</Typography>
				)}
			</div>
		);
	}
);
