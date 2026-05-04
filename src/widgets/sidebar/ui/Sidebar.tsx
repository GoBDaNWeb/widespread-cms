import { Link } from '@tanstack/react-router';
import { BsBoxArrowLeft, BsColumnsGap, BsHouse, BsPeople } from 'react-icons/bs';

import { useLogout } from '@/features/auth';

import { ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui';

const sidebarLinksList = [
	{
		icon: <BsHouse />,
		title: 'Home',
		href: ROUTES.HOME
	},
	{
		icon: <BsColumnsGap />,
		title: 'Dashboard',
		href: ROUTES.DASHBOARD
	},
	{
		icon: <BsPeople />,
		title: 'Users',
		href: ROUTES.USERS
	}
];

export const Sidebar = () => {
	const logout = useLogout();

	const handleLogout = () => {
		logout.mutate();
	};

	return (
		<div className='shadow-primary bg-surface flex h-screen flex-col rounded-tr-2xl rounded-br-2xl p-5 pb-16'>
			<Link to={ROUTES.HOME} className='hover:text-accent-hover trs typography-h2 mb-9 text-center'>
				Widespread CMS
			</Link>
			<div className='flex flex-1 flex-col gap-2'>
				{sidebarLinksList.map(link => (
					<Link
						to={link.href}
						className='hover:text-accent-hover [&.active]:text-accent [&.active]:hover:text-accent typography-body-lg trs flex items-center gap-1.5'
					>
						{link.icon}
						{link.title}
					</Link>
				))}
			</div>
			<div>
				<Button
					variant='clear'
					size='clear'
					onClick={handleLogout}
					className='text-error hover:text-error-hover trs typography-caption flex items-baseline'
				>
					<BsBoxArrowLeft />
					Logout
				</Button>
			</div>
		</div>
	);
};
