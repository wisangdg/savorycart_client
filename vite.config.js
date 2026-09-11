import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { transform as esbuildTransform } from "esbuild";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.ico", "logo192.png", "logo512.png"],
			manifest: {
				name: "SavoryCart",
				short_name: "SavoryCart",
				description: "Smart Food Ordering Platform",
				theme_color: "#ffffff",
				icons: [
					{
						src: "logo192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "logo512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
			},
		}),
	],
	server: {
		port: 5173,
		open: true,
		proxy: {
			// Proxy API dan auth ke server Express di :3000
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
				secure: false,
			},
			"/auth": {
				target: "http://localhost:3000",
				changeOrigin: true,
				secure: false,
			},
			// Proxy static images served by backend (so <img src="/images/..."> works in dev)
			"/images": {
				target: "http://localhost:3000",
				changeOrigin: true,
				secure: false,
			},
		},
	},
	// Izinkan JSX di file .js (banyak file masih .js tapi berisi JSX)
	esbuild: {
		jsx: "automatic",
		loader: "jsx",
		include: /src\/.*\.(js|jsx)$/,
	},
	optimizeDeps: {
		esbuildOptions: {
			loader: {
				".js": "jsx",
				".jsx": "jsx",
			},
		},
	},
	preview: {
		port: 4173,
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTests.js",
		css: true,
	},
});
