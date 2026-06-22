/**
 * @filename: nano-staged.js}
  @import {FnConfiguration, ObjConfiguration} from 'nano-staged'
 */

/**
 * @param {Parameters<FnConfiguration>[0]} api
 */
const eslint = ({ filenames }) => `eslint --cache --fix ${filenames.join(" ")}`;

/** @type {ObjConfiguration} */
export default {
	"server/src/**/*.{ts,tsx}": (api) => [
		"tsc -b server/tsconfig.json",
		eslint(api),
	],
	"client/src/**/*.{ts,tsx}": (api) => [
		"tsc -b client/tsconfig.json",
		eslint(api),
	],
	"shared/src/**/*.{ts,tsx}": (api) => [
		"tsc -b shared/tsconfig.json",
		eslint(api),
	],
	"**/*.{css,json,js,ts,tsx}": ["prettier --write"],
};
