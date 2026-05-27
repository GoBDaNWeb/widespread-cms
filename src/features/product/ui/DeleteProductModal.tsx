import {
	Button,
	Modal,
	type ModalComponentProps,
	Spinner,
	Typography,
	useModalPayload
} from '@/shared/ui';

import { useDeleteProduct } from '../api';

export const DeleteProductModal = ({ isOpen, close }: ModalComponentProps) => {
	const modalPayload = useModalPayload<{ productId: number } | null>();
	const { mutateAsync: deleteProduct, isPending } = useDeleteProduct();

	const handleDeleteProduct = () => {
		if (!modalPayload?.productId) return;
		deleteProduct(modalPayload.productId, {
			onSuccess: () => {
				close();
			}
		});
	};

	return (
		<Modal isOpen={isOpen} close={close} className='shadow-primary rounded-2xl p-6'>
			<Typography variant='h3' as='h3' className='mb-6 text-center'>
				Are you sure you want to delete product with {modalPayload?.productId} id?
			</Typography>
			<div className='flex gap-3'>
				<Button
					variant='danger'
					onClick={handleDeleteProduct}
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
