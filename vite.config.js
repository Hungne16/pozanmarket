import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig( {
	build: {
		outDir: 'dist',
		rollupOptions: {
			input: {
				portfolio: resolve( import.meta.dirname, 'portfolio/index.html' ),
				admin: resolve( import.meta.dirname, 'portfolio/admin.html' )
			}
		}
	}
} );
