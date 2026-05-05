import { useModalStore } from './store';

export const useOpenModal = () => useModalStore(s => s.openModal);
export const useCloseModal = () => useModalStore(s => s.closeModal);
export const useCurrentModal = () => useModalStore(s => s.currentModal);
