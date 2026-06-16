import type { Request } from "express";
import { afterEach, describe, expect, test } from "vitest";

import {
	buildSessionCookie,
	clearSessionCookie,
	readSessionCookie,
} from "./cookie.ts";

const req = (cookie?: string) =>
	({ headers: { cookie } }) as unknown as Request;

describe("buildSessionCookie", () => {
	afterEach(() => {
		process.env.NODE_ENV = "test";
	});

	test("contains required attributes and starts with session=", () => {
		const cookie = buildSessionCookie("mytoken");
		expect(cookie).toMatch(/^session=/);
		expect(cookie).toContain("HttpOnly");
		expect(cookie).toContain("SameSite=Strict");
		expect(cookie).toContain("Path=/");
		expect(cookie).toContain("Max-Age=3600");
	});

	test("does NOT contain Secure when NODE_ENV is not production", () => {
		expect(buildSessionCookie("mytoken")).not.toContain("Secure");
	});

	test("contains Secure when NODE_ENV is production", () => {
		process.env.NODE_ENV = "production";
		expect(buildSessionCookie("mytoken")).toContain("Secure");
	});
});

describe("clearSessionCookie", () => {
	test("targets the session cookie with Max-Age=0", () => {
		const cookie = clearSessionCookie();
		expect(cookie).toMatch(/^session=/);
		expect(cookie).toContain("Max-Age=0");
	});
});

describe("readSessionCookie", () => {
	test("returns the token value for a valid session cookie", () => {
		expect(readSessionCookie(req("session=mytoken"))).toBe("mytoken");
	});

	test("returns null when headers.cookie is undefined", () => {
		expect(readSessionCookie(req())).toBeNull();
	});

	test("returns null when session key is absent", () => {
		expect(readSessionCookie(req("foo=bar; baz=qux"))).toBeNull();
	});

	test("finds session among multiple cookies", () => {
		expect(readSessionCookie(req("foo=bar; session=tok; baz=qux"))).toBe("tok");
	});

	test("returns null for an empty cookie header", () => {
		expect(readSessionCookie(req(""))).toBeNull();
	});
});
