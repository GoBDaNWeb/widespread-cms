import { Link } from '@tanstack/react-router';

import { ROUTES } from '@/shared/config';

export const AboutPage = () => {
	return (
		<main className='flex flex-col gap-1'>
			<h1>About page</h1>
			<Link to={ROUTES.HOME} className='link'>
				link to home page
			</Link>
		</main>
	);
};
