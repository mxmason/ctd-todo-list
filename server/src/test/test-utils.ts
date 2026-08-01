import type { Request } from "express";
import { afterEach, beforeEach, vi } from "vitest";

export * from "vitest";
export { api, agent } from "./helpers.ts";
export { useTestDb, seedUserSession } from "./db.ts";

export function mockRes() {
	const json = vi.fn();
	const status = vi.fn().mockReturnValue({ json });
	return { status, json, headersSent: false };
}

export function mockReq(partial: Partial<Request> = {}): Request {
	return partial as unknown as Request;
}

let userCounter = 0;

export function freshUser(): { username: string; password: string } {
	userCounter += 1;
	return { username: `user${userCounter}`, password: "supersecret" };
}

export function stubEnv(vars: Record<string, string>): void {
	const original = { ...process.env };
	beforeEach(() => {
		Object.assign(process.env, vars);
	});
	afterEach(() => {
		process.env = { ...original };
	});
}
