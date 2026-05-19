import type { ReactNode } from 'react';

import { badge } from './badge.variants';

type BadgeProps = {
	children: ReactNode;
	variant?: 'primary';
};

export const Badge = ({ variant = 'primary', children }: BadgeProps) => {
	// return <div className=''>{children}</div>;
	return <div className={badge({ variant })}>{children}</div>;
};
