import { dirname } from "path";
import { fileURLToPath } from "url";

import { defineMain } from "@storybook/react-vite/node";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
	return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
export default defineMain({
	stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [
		getAbsolutePath("@storybook/addon-mcp"),
		getAbsolutePath("@storybook/addon-vitest"),
	],
	framework: getAbsolutePath("@storybook/react-vite"),
	staticDirs: ["../public"],
});
