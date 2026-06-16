import js from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";
import { createNodeResolver } from "eslint-plugin-import-x/node-resolver";
import perfectionist from "eslint-plugin-perfectionist";
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
			"import-x/resolver-next": [createNodeResolver({ tsconfig: "auto" })],
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
		extends: [eslintReact.configs["recommended-typescript"]],
		languageOptions: {
			globals: globals.browser,
			parserOptions: { tsconfigRootDir: dirname + "/client" },
		},
		plugins: {
			"react-refresh": reactRefresh,
			perfectionist,
		},
		rules: {
			"react-refresh/only-export-components": "warn",
			"@eslint-react/web-api-no-leaked-fetch": "off",
			"perfectionist/sort-jsx-props": [
				"error",
				{
					type: "alphabetical",
					groups: ["reserved", "prop", "callback"],
					customGroups: [
						{ groupName: "reserved", elementNamePattern: "^(key|ref)$" },
						{ groupName: "callback", elementNamePattern: "^on.+" },
					],
				},
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
