import { createStore } from '@/shared/lib';

type ModalState = {
	currentModal: string;

	openModal: (modal: string) => void;
	closeModal: () => void;
};

export const useModalStore = createStore<ModalState>('ui/modal', set => ({
	isOpen: false,
	currentModal: '',

	openModal: (modal: string) => set({ currentModal: modal }, false, 'modal/open'),
	closeModal: () => set({ currentModal: '' }, false, 'modal/close')
}));
