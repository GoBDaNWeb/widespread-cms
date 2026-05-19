import { type ReactNode } from 'react';

import { Typography } from '@/shared/ui';

type ResourceLayoutProps = {
	title: string;
	actions?: ReactNode;
	filters?: ReactNode;
	children?: ReactNode;
};

export const ResourceLayout = ({ title, actions, filters, children }: ResourceLayoutProps) => {
	return (
		<div className='flex h-full flex-col gap-5'>
			<div className='bg-surface shadow-primary flex items-center justify-between rounded-2xl p-5'>
				<Typography variant='h1' as='h1'>
					{title}
				</Typography>
				<div className='flex items-center gap-3'>{actions}</div>
			</div>
			{filters && <div className='bg-surface shadow-primary rounded-2xl p-5'>{filters}</div>}
			{children}
		</div>
	);
};
