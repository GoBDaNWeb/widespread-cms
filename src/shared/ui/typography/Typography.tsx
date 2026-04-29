import type { HTMLAttributes, JSX } from 'react';

import type { VariantProps } from 'class-variance-authority';

import { typography } from './typography.variant';

type TypographyProps = HTMLAttributes<HTMLElement> &
	VariantProps<typeof typography> & {
		as?: keyof JSX.IntrinsicElements;
	};

export const Typography = ({ variant, as: Tag = 'p', className, children }: TypographyProps) => {
	return <Tag className={typography({ variant, className })}>{children}</Tag>;
};
