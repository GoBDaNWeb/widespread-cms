import { type FC, useEffect, useState } from 'react';

import { LogoutModal } from '@/features/auth';
import {
	BulkDeleteProductsModal,
	CreateProductModal,
	DeleteProductModal,
	UpdateProductModal
} from '@/features/product';

import type { ModalComponentProps } from '@/shared/ui';
import { useCloseModal, useCurrentModal } from '@/shared/ui/modal';

const modals: Record<string, FC<ModalComponentProps>> = {
	logout: LogoutModal,
	deleteProduct: DeleteProductModal,
	createProduct: CreateProductModal,
	updateProduct: UpdateProductModal,
	bulkDeleteProducts: BulkDeleteProductsModal
};

export const ModalManager = () => {
	const currentModal = useCurrentModal();
	const closeModal = useCloseModal();
	const [visibleModal, setVisibleModal] = useState<string | null>(null);

	useEffect(() => {
		if (currentModal) setVisibleModal(currentModal);
	}, [currentModal]);

	if (!visibleModal) return null;

	const ModalComponent = modals[visibleModal];
	if (!ModalComponent) return null;

	return <ModalComponent isOpen={!!currentModal} close={closeModal} />;
};
