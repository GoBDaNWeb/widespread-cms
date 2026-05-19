import type { FC } from 'react';

import { LogoutModal } from '@/features/auth';
import { DeleteProductModal } from '@/features/products';

import type { ModalComponentProps } from '@/shared/ui';
import { useCloseModal, useCurrentModal } from '@/shared/ui/modal';

const modals: Record<string, FC<ModalComponentProps>> = {
	logout: LogoutModal,
	deleteProduct: DeleteProductModal
};

export const ModalManager = () => {
	const currentModal = useCurrentModal();
	const closeModal = useCloseModal();

	return (
		<>
			{Object.entries(modals).map(([name, ModalComponent]) => (
				<ModalComponent key={name} isOpen={name === currentModal} close={closeModal} />
			))}
		</>
	);
};
