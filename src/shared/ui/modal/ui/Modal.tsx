import { type ReactNode, forwardRef, useCallback, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import clsx from 'clsx';

import { Portal } from '@/shared/ui';

import './modal.scss';

type ModalProps = {
	isOpen: boolean;
	direction?: 'left' | 'center';
	className?: string;
	close: () => void;
	children: ReactNode;
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
	({ isOpen, close, direction = 'center', className, children }, ref) => {
		const nodeRef = useRef<HTMLDivElement | null>(null);
		const handleRef = useCallback(
			(el: HTMLDivElement | null) => {
				nodeRef.current = el;
				if (typeof ref === 'function') ref(el);
				else if (ref) ref.current = el;
			},
			[ref]
		);

		const modalClass = clsx(
			'modal trs flex-center bg-overlay fixed inset-0 z-50 flex backdrop-blur-sm',
			direction
		);
		const modalContentClass = clsx('modal-content trs bg-surface max-w-100 my-6 ', className);

		return (
			<Portal rootId='#modal'>
				<CSSTransition
					classNames='modal'
					appear
					unmountOnExit
					in={isOpen}
					timeout={{ exit: 300, enter: 1 }}
					nodeRef={nodeRef}
				>
					<div
						role='dialog'
						className={modalClass}
						aria-modal='true'
						onClick={close}
						ref={handleRef}
					>
						<div
							role='presentation'
							className={modalContentClass}
							onClick={e => e.stopPropagation()}
						>
							{children}
						</div>
					</div>
				</CSSTransition>
			</Portal>
		);
	}
);
