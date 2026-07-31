/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { BrowserRouter } from "react-router";
import { SWRConfig } from "swr";
import { render as vitestRender } from "vitest-browser-react";

import { AuthProvider } from "#context/auth/AuthContext.tsx";

export * from "vitest";
export * from "vitest-browser-react";
export { worker } from "./setup.ts";
export { http, HttpResponse } from "msw";

export function render(ui: React.ReactElement) {
	return vitestRender(
		<SWRConfig value={{ provider: () => new Map() }}>
			<BrowserRouter>
				<AuthProvider>{ui}</AuthProvider>
			</BrowserRouter>
		</SWRConfig>,
	);
}
