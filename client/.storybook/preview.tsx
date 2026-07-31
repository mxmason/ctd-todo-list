import { definePreview } from "@storybook/react-vite";
import addonMsw from "msw-storybook-addon";
import { setupWorker } from "msw/browser";
import { BrowserRouter } from "react-router";
import { SWRConfig } from "swr";

import { AuthProvider } from "#context/auth/AuthContext.tsx";
import { handlers } from "#test/msw-handlers.ts";

// `logged_in` is the only browser-state key the app reads at render
// (AuthProvider checks document.cookie). Seed it so the auth flow runs
// the /users/me request that MSW serves.
document.cookie = "logged_in=1; Path=/; SameSite=Strict";

// Seed the worker with the default handlers so they're always restored
// between stories. Story-level `beforeEach({ msw })` hooks then layer
// one-off overrides on top via `msw.use(...)`.
const setupMsw = async () => {
	const worker = setupWorker(...handlers);
	await worker.start({ onUnhandledRequest: "bypass" });
	return worker;
};

export default definePreview({
	addons: [addonMsw(setupMsw)],
	decorators: [
		(Story) => (
			<SWRConfig value={{ provider: () => new Map() }}>
				<BrowserRouter>
					<AuthProvider>
						<Story />
					</AuthProvider>
				</BrowserRouter>
			</SWRConfig>
		),
	],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
});
