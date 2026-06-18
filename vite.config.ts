import react from '@vitejs/plugin-react';

import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/shared/test/setup.ts'],
		include: ['src/**/*.{test,spec}.{ts,tsx}']
	},
	server: {
		proxy: {
			'/api': {
				target: process.env.VITE_API_URL ?? 'http://127.0.0.1:8000',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, '')
			}
		}
	},
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@/app': path.resolve(__dirname, 'src/app'),
			'@/pages': path.resolve(__dirname, 'src/pages'),
			'@/widgets': path.resolve(__dirname, 'src/widgets'),
			'@/features': path.resolve(__dirname, 'src/features'),
			'@/entities': path.resolve(__dirname, 'src/entities'),
			'@/shared': path.resolve(__dirname, 'src/shared')
		}
	}
});
