import {
	Button,
	Modal,
	type ModalComponentProps,
	Spinner,
	Typography,
	useModalPayload
} from '@/shared/ui';

import { useBulkDeleteProducts } from '../api';

export const BulkDeleteProductsModal = ({ isOpen, close }: ModalComponentProps) => {
	const modalPayload = useModalPayload<{ productIds: number[] } | null>();
	const { mutateAsync: bulkDelete, isPending } = useBulkDeleteProducts();

	const handleDelete = () => {
		if (!modalPayload?.productIds?.length) return;
		bulkDelete(modalPayload.productIds, {
			onSuccess: () => close()
		});
	};

	const count = modalPayload?.productIds?.length ?? 0;

	return (
		<Modal isOpen={isOpen} close={close} className='shadow-primary rounded-2xl p-6'>
			<Typography variant='h3' as='h3' className='mb-6 text-center'>
				Are you sure you want to delete {count} {count === 1 ? 'product' : 'products'}?
			</Typography>
			<div className='flex gap-3'>
				<Button
					variant='danger'
					onClick={handleDelete}
					className='flex-1'
					disabled={isPending}
				>
					{isPending ? <Spinner /> : 'Delete'}
				</Button>
				<Button variant='primary' onClick={close} className='flex-1'>
					Close
				</Button>
			</div>
		</Modal>
	);
};
