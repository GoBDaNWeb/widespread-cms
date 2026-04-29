import { type StateCreator, create } from 'zustand';

import { devtools } from 'zustand/middleware';

export const createStore = <T>(name: string, fn: StateCreator<T, [['zustand/devtools', never]]>) =>
	create<T>()(
		devtools(fn, {
			name,
			enabled: true
			// enabled: process.env.NODE_ENV === 'development'
		})
	);
