import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
	{ ignores: ["**/dist", "**/node_modules"] },
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			parserOptions: { tsconfigRootDir: rootDir },
		},
		plugins: { "import-x": importX },
		settings: {
			"import-x/resolver": { typescript: true, node: true },
		},
		rules: {
			// Unused-variable detection is delegated to TypeScript's noUnusedLocals /
			// noUnusedParameters (tsconfig.base.json), which — unlike this rule — counts
			// JSDoc {@link} references as usage and natively ignores _-prefixed params.
			// This avoids eslint-disable comments on imports that exist only for doc links.
			"@typescript-eslint/no-unused-vars": "off",
			"import-x/order": [
				"error",
				{
					groups: [
						"builtin",
						"external",
						"internal",
						["parent", "sibling", "index"],
					],
					"newlines-between": "always",
					alphabetize: { order: "asc", caseInsensitive: true },
				},
			],
		},
	},
	{
		files: ["client/**/*.{ts,tsx}"],
		languageOptions: {
			globals: globals.browser,
			parserOptions: { tsconfigRootDir: path.join(rootDir, "client") },
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
			react,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"react-refresh/only-export-components": "warn",
			"react/jsx-sort-props": [
				"error",
				{ reservedFirst: true, callbacksLast: true },
			],
		},
	},
	{
		files: ["server/**/*.ts"],
		languageOptions: {
			globals: globals.node,
			parserOptions: { tsconfigRootDir: path.join(rootDir, "server") },
		},
	},
	prettier,
);
