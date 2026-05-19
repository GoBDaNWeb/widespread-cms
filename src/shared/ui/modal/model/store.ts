import { createStore } from '@/shared/lib';

type ModalState = {
	currentModal: string;
	modalPayload: unknown;

	openModal: (modal: string, payload?: unknown) => void;
	closeModal: () => void;
};

export const useModalStore = createStore<ModalState>('ui/modal', set => ({
	currentModal: '',
	modalPayload: {},

	openModal: (modal, payload = null) =>
		set({ currentModal: modal, modalPayload: payload }, false, 'modal/open'),
	closeModal: () => set({ currentModal: '' }, false, 'modal/close')
}));
