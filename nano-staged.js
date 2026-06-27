/**
 * @filename: nano-staged.js}
  @import {FnConfiguration, ObjConfiguration} from 'nano-staged'
	@typedef {Parameters<FnConfiguration>[0]} NanoStagedApi
 */

/** @param {NanoStagedApi} api */
const oxfmt = ({ filenames }) => `oxfmt ${filenames.join(" ")}`;
/** @param {NanoStagedApi} api */
const oxlint = ({ filenames }) => `oxlint --fix ${filenames.join(" ")}`;
/** @param {NanoStagedApi} api */
const eslint = ({ filenames }) => `eslint --cache --fix ${filenames.join(" ")}`;

/** @type {ObjConfiguration} */
export default {
	"server/src/**/*.{ts,tsx}": (api) => [
		"tsc -b server/tsconfig.json",
		oxlint(api),
		eslint(api),
	],
	"client/src/**/*.{ts,tsx}": (api) => [
		"tsc -b client/tsconfig.json",
		oxlint(api),
		eslint(api),
	],
	"shared/src/**/*.{ts,tsx}": (api) => [
		"tsc -b shared/tsconfig.json",
		oxlint(api),
		eslint(api),
	],
	"**/*.{js,ts,tsx,json}": oxfmt,
};
