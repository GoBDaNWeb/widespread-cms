import type { ReactNode } from 'react';

import type { VariantProps } from 'class-variance-authority';

import { badge } from './badge.variants';

type BadgeProps = {
	children: ReactNode;
} & VariantProps<typeof badge>;

export const Badge = ({ variant, children }: BadgeProps) => {
	// return <div className=''>{children}</div>;
	return <div className={badge({ variant })}>{children}</div>;
};
