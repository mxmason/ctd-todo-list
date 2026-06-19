import * as React from "react";
import { BrowserRouter } from "react-router";
import { render as vitestRender } from "vitest-browser-react";

import { AuthProvider } from "#context/auth/index.ts";

export * from "vitest";
export * from "vitest-browser-react";
export { worker } from "./setup.ts";
export { http, HttpResponse } from "msw";

export function render(ui: React.ReactElement) {
	return vitestRender(
		<BrowserRouter>
			<AuthProvider>{ui}</AuthProvider>
		</BrowserRouter>,
	);
}
