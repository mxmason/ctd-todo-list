/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
	"*.{ts,tsx}": [() => "npm run typecheck", "eslint --fix"],
	"*.{css,json,js,ts,tsx}": ["prettier --write"],
};
