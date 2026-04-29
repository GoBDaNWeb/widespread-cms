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
	className,
	children,
	type = 'button',
	...props
}: ButtonProps) => {
	return (
		<button type={type} className={button({ variant, size, className })} {...props}>
			{children}
		</button>
	);
};
