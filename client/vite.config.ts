import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
	css: {
		modules: {
			localsConvention: "camelCase",
		},
	},
	plugins: [
		babel({
			include: /\.[jt]sx?$/,
			presets: [reactCompilerPreset()],
		}),
		react(),
	],
	server: {
		port: 3000,
		proxy:
			process.env.VITEST === "true"
				? undefined
				: {
						"/api": {
							target: "http://localhost:3001",
							changeOrigin: true,
						},
					},
	},
	test: {
		name: "browser",
		include: ["src/**/*.test.tsx"],
		browser: {
			enabled: true,
			headless: true,
			provider: playwright({}),
			instances: [{ browser: "chromium" }],
			screenshotFailures: false,
		},
		setupFiles: ["./src/test/setup.ts"],
		onConsoleLog(log) {
			if (log.includes("[MSW]")) return false;
		},
	},
});
