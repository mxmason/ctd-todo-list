import { describe, expect, test } from "vitest";

import { api } from "#test/helpers.ts";

describe("routing", () => {
	test("404s on unknown routes", async () => {
		const res = await api().get("/does-not-exist").expect(404);
		expect(res.body.code).toBe("not_found");
	});
});

describe("security headers", () => {
	test("sets a strict CSP and hardening headers", async () => {
		const res = await api().get("/api/todos");
		expect(res.headers["content-security-policy"]).toBe(
			"default-src 'none'; frame-ancestors 'none'",
		);
		expect(res.headers["x-content-type-options"]).toBe("nosniff");
		expect(res.headers["referrer-policy"]).toBe("no-referrer");
		expect(res.headers["cross-origin-resource-policy"]).toBe("same-origin");
		expect(res.headers["strict-transport-security"]).toMatch(/max-age=\d+/);
	});

	test("does not advertise the server framework", async () => {
		const res = await api().get("/api/todos");
		expect(res.headers["x-powered-by"]).toBeUndefined();
	});
});

describe("body parsing", () => {
	test("returns 400 invalid_json for malformed bodies", async () => {
		const res = await api()
			.post("/does-not-exist")
			.set("Content-Type", "application/json")
			.send("{not json");
		expect(res.status).toBe(400);
		expect(res.body).toEqual({
			code: "invalid_json",
			message: "malformed JSON body",
		});
	});

	test("returns 413 payload_too_large for oversized bodies", async () => {
		const res = await api()
			.post("/does-not-exist")
			.set("Content-Type", "application/json")
			.send({ blob: "x".repeat(11 * 1024) });
		expect(res.status).toBe(413);
		expect(res.body.code).toBe("payload_too_large");
	});
});
