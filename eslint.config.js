import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import { configs as tsConfigs } from "typescript-eslint";

const { dirname } = import.meta;

export default defineConfig(
	{ ignores: ["**/dist", "**/node_modules"] },
	js.configs.recommended,
	...tsConfigs.recommended,
	{
		plugins: { "import-x": importX },
		settings: {
			"import-x/resolver": { typescript: true, node: true },
		},
		rules: {
			// Delegated to TypeScript's noUnusedLocals/noUnusedParameters, which counts
			// JSDoc {@link} references as usage and ignores _-prefixed params natively.
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
					pathGroups: [{ pattern: "{#*,#*/**}", group: "internal" }],
					pathGroupsExcludedImportTypes: ["builtin"],
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
			parserOptions: { tsconfigRootDir: dirname + "/client" },
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
			parserOptions: { tsconfigRootDir: dirname + "/server" },
		},
	},
	prettier,
);
