// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import tsParser from "@typescript-eslint/parser";
import perfectionist from "eslint-plugin-perfectionist";
import reactRefresh from "eslint-plugin-react-refresh";
import storybook from "eslint-plugin-storybook";
import { defineConfig } from "eslint/config";

const { dirname } = import.meta;

export default defineConfig(
	{ files: ["**/*.{ts,tsx,cts,mts}"], languageOptions: { parser: tsParser } },
	{
		ignores: [
			"**/dist",
			"**/node_modules",
			"server/src/generated/**",
			"client/public/mockServiceWorker.js",
		],
	},
	{
		files: ["client/**/*.{ts,tsx}"],
		languageOptions: {
			parserOptions: { tsconfigRootDir: dirname + "/client" },
		},
		plugins: {
			"react-refresh": reactRefresh,
			perfectionist,
		},
		rules: {
			"react-refresh/only-export-components": "warn",
			"perfectionist/sort-jsx-props": [
				"error",
				{
					type: "alphabetical",
					groups: ["reserved", "prop", "callback", "boolean"],
					customGroups: [
						{ groupName: "reserved", elementNamePattern: "^(key|ref)$" },
						{ groupName: "callback", elementNamePattern: "^on.+" },
						{ groupName: "boolean", modifiers: ["shorthand"] },
					],
				},
			],
		},
	},
	...storybook.configs["flat/recommended"],
);
