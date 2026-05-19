import { Button, Modal, type ModalComponentProps, Typography, useModalPayload } from '@/shared/ui';

import { useDeleteProduct } from '../model';

export const DeleteProductModal = ({ isOpen, close }: ModalComponentProps) => {
	const modalPayload = useModalPayload<{ productId: number } | null>();

	const deleteProduct = useDeleteProduct();

	const handleDeleteProduct = () => {
		if (!modalPayload?.productId) return;
		deleteProduct.mutate(modalPayload.productId, {
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
					disabled={deleteProduct.isPending}
				>
					{deleteProduct.isPending ? 'Loading...' : 'Delete'}
				</Button>
				<Button variant='primary' onClick={close} className='flex-1'>
					Close
				</Button>
			</div>
		</Modal>
	);
};
