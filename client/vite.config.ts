import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		babel({
			include: /\.[jt]sx?$/,
			presets: [reactCompilerPreset()],
		}),
		react(),
	],
	server: {
		port: 3000,
		proxy: {
			"/api": {
				target: "http://localhost:3001",
				changeOrigin: true,
			},
		},
	},
});
