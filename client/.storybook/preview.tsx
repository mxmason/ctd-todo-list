import { definePreview } from "@storybook/react-vite";
import { initialize, mswLoader } from "msw-storybook-addon";
import { BrowserRouter } from "react-router";

import { AuthProvider } from "#context/auth/AuthContext.tsx";
import { handlers } from "#test/msw-handlers.ts";

// `logged_in` is the only browser-state key the app reads at render
// (AuthProvider checks document.cookie). Seed it so the auth flow runs
// the /users/me request that MSW serves.
document.cookie = "logged_in=1; Path=/; SameSite=Strict";

// Pass handlers as initial handlers so resetHandlers() always restores the full
// default set. Story-level parameters.msw.handlers are then prepended as
// one-off overrides that take priority (first-match-wins).
initialize({ onUnhandledRequest: "bypass" }, handlers);

export default definePreview({
	addons: [],
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
	},
});
