import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// import glsl from 'vite-plugin-glsl';
// import vitePluginString from 'vite-plugin-string'

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		esbuildOptions: {
			loader: {
				".js": "text",
			},
		},
	},
});
