import { type ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type PortalProps = {
	rootId: string;
	children: ReactNode;
};

export const Portal = ({ rootId, children }: PortalProps) => {
	const [mounted, setMounted] = useState(false);

	const containerRef = useRef<Element | null>(null);

	useEffect(() => {
		containerRef.current = document.querySelector(`${rootId}`);
		if (containerRef.current) setMounted(true);
		return () => setMounted(false);
	}, [rootId]);

	return mounted && Boolean(containerRef.current)
		? createPortal(children, containerRef.current!)
		: null;
};
