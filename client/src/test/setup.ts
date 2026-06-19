import { setupWorker } from "msw/browser";
import type { SetupWorker } from "msw/browser";
import { beforeAll, afterEach } from "vitest";

import { handlers } from "./msw-handlers.ts";

declare global {
	interface Window {
		__mswWorker?: SetupWorker;
	}
}

if (!window.__mswWorker) {
	window.__mswWorker = setupWorker(...handlers);
}

export const worker = window.__mswWorker;

beforeAll(async () => {
	if (!navigator.serviceWorker.controller) {
		await worker.start({ onUnhandledRequest: "bypass" });
	}
	document.cookie = "logged_in=1; Path=/; SameSite=Strict";
});

afterEach(() => worker.resetHandlers());
