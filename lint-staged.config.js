/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
	"server/src/**/*.{ts,tsx}": [
		() => "node_modules/.bin/tsgo -b server/tsconfig.json",
		"eslint --fix",
	],
	"client/src/**/*.{ts,tsx}": [
		() => "node_modules/.bin/tsgo -b client/tsconfig.json",
		"eslint --fix",
	],
	"shared/src/**/*.{ts,tsx}": [
		() => "node_modules/.bin/tsgo -b shared/tsconfig.json",
		"eslint --fix",
	],
	"**/*.{css,json,js,ts,tsx}": ["prettier --write"],
};
