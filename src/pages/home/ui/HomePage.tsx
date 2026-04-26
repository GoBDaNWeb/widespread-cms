import { Link } from '@tanstack/react-router';

import { ROUTES } from '@/shared/config';

export const HomePage = () => {
	return (
		<main className='flex flex-col gap-1'>
			<h1>Home page</h1>
			<Link to={ROUTES.ABOUT} className='link'>
				link to about page
			</Link>
		</main>
	);
};
