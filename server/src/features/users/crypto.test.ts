import { SignJWT } from "jose";
import { afterEach, describe, expect, test, vi } from "vitest";

import {
	hashPassword,
	SESSION_TTL_SECONDS,
	signToken,
	verifyPassword,
	verifyToken,
} from "./crypto.ts";

describe("hashPassword", () => {
	test("output matches <hex>:<hex> format", async () => {
		const hash = await hashPassword("mysecret");
		expect(hash).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
	});

	test("two calls with the same input produce different salts", async () => {
		const [a, b] = await Promise.all([
			hashPassword("same"),
			hashPassword("same"),
		]);
		const saltA = a.split(":")[0];
		const saltB = b.split(":")[0];
		expect(saltA).not.toBe(saltB);
	});
});

describe("verifyPassword", () => {
	test("returns true for a correct password", async () => {
		const hash = await hashPassword("correct-horse");
		expect(await verifyPassword("correct-horse", hash)).toBe(true);
	});

	test("returns false for a wrong password", async () => {
		const hash = await hashPassword("correct-horse");
		expect(await verifyPassword("wrong-password", hash)).toBe(false);
	});

	test("returns false for a malformed stored value (no colon)", async () => {
		expect(await verifyPassword("any", "notavalidhash")).toBe(false);
	});
});

describe("signToken", () => {
	test("returns a string with two dots (JWT shape)", async () => {
		const token = await signToken("user-123");
		expect(typeof token).toBe("string");
		expect(token.split(".")).toHaveLength(3);
	});
});

describe("verifyToken", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	test("accepts a valid token and returns userId", async () => {
		const token = await signToken("user-abc");
		const result = await verifyToken(token);
		expect(result).toEqual({ userId: "user-abc" });
	});

	test("rejects a token signed with a different key", async () => {
		const wrongKey = new TextEncoder().encode("wrong-secret");
		const token = await new SignJWT({})
			.setProtectedHeader({ alg: "HS256" })
			.setSubject("x")
			.setExpirationTime("1h")
			.sign(wrongKey);
		await expect(verifyToken(token)).rejects.toThrow();
	});

	test("rejects an expired token", async () => {
		vi.useFakeTimers();
		const token = await signToken("user-exp");
		vi.setSystemTime(Date.now() + SESSION_TTL_SECONDS * 1000 + 1000);
		await expect(verifyToken(token)).rejects.toThrow();
	});

	test("rejects an alg:none token", async () => {
		const now = Math.floor(Date.now() / 1000);
		const header = Buffer.from(JSON.stringify({ alg: "none" })).toString(
			"base64url",
		);
		const payload = Buffer.from(
			JSON.stringify({ sub: "x", iat: now, exp: now + 3600 }),
		).toString("base64url");
		const noneToken = `${header}.${payload}.`;
		await expect(verifyToken(noneToken)).rejects.toThrow();
	});

	test("rejects a tampered payload", async () => {
		const token = await signToken("user-real");
		const parts = token.split(".");
		const now = Math.floor(Date.now() / 1000);
		const tamperedPayload = Buffer.from(
			JSON.stringify({ sub: "attacker", iat: now, exp: now + 3600 }),
		).toString("base64url");
		const tampered = `${parts[0]}.${tamperedPayload}.${parts[2]}`;
		await expect(verifyToken(tampered)).rejects.toThrow();
	});
});
