import type { Preview } from "@storybook/react-vite";
import { initialize, mswLoader } from "msw-storybook-addon";
import { BrowserRouter } from "react-router";

import { AuthProvider } from "../src/context/auth/index.ts";

import { handlers } from "./msw-handlers.ts";

// `logged_in` is the only browser-state key the app reads at render
// (AuthProvider checks document.cookie). Seed it so the auth flow runs
// the /users/me request that MSW serves.
document.cookie = "logged_in=1; Path=/; SameSite=Strict";

initialize({ onUnhandledRequest: "bypass" });

const preview: Preview = {
	decorators: [
		(Story) => (
			<BrowserRouter>
				<AuthProvider>
					<Story />
				</AuthProvider>
			</BrowserRouter>
		),
	],
	loaders: [mswLoader],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		msw: { handlers },
	},
};

export default preview;
