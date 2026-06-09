import { useNavigate, useSearch } from '@tanstack/react-router';

import { PAGE_COUNTS } from '@/shared/config';
import { type Option, Selector, Typography } from '@/shared/ui';

export const ProductsFilters = () => {
	const { page_count = 10 } = useSearch({ strict: false }) as { page_count?: number };
	const navigate = useNavigate();

	const handlePageCountChange = (option: Option<number> | null) => {
		if (!option) return;
		navigate({
			to: '.',
			search: prev => ({ ...prev, page: 1, page_count: option.value })
		});
	};

	const value = PAGE_COUNTS.find(o => o.value === page_count);

	return (
		<div className='flex flex-col gap-5'>
			<Typography variant='h3' as='h3'>
				Filters
			</Typography>
			<div>
				<Selector
					name='page_count'
					hint='Items per page'
					options={PAGE_COUNTS}
					value={value}
					onChange={option => handlePageCountChange(option as Option<number>)}
				/>
			</div>
		</div>
	);
};
