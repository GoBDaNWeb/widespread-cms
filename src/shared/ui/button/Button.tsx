import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { type VariantProps } from 'class-variance-authority';

import { button } from './button.variants';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
	VariantProps<typeof button> & {
		children: ReactNode;
		type?: 'button' | 'submit';
	};

export const Button = ({
	variant,
	size,
	disabled,
	className,
	children,
	type = 'button',
	...props
}: ButtonProps) => {
	return (
		<button
			type={type}
			disabled={disabled}
			className={button({ variant, size, disabled: !!disabled, className })}
			{...props}
		>
			{children}
		</button>
	);
};
