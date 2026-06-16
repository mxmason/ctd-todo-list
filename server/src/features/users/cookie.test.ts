import type { Request } from "express";
import { afterEach, describe, expect, test } from "vitest";

import {
	buildIndicatorCookie,
	buildSessionCookie,
	clearIndicatorCookie,
	clearSessionCookie,
	readSessionCookie,
} from "./cookie.ts";

const req = (cookie?: string) =>
	({ headers: { cookie } }) as unknown as Request;

function assertCommonAttrs(getCookie: () => string) {
	test("has SameSite=Strict, Path=/, and Max-Age=3600", () => {
		const cookie = getCookie();
		expect(cookie).toContain("SameSite=Strict");
		expect(cookie).toContain("Path=/");
		expect(cookie).toContain("Max-Age=3600");
	});

	test("omits Secure outside production", () => {
		expect(getCookie()).not.toContain("Secure");
	});

	test("adds Secure in production", () => {
		process.env.NODE_ENV = "production";
		expect(getCookie()).toContain("Secure");
	});
}

afterEach(() => {
	process.env.NODE_ENV = "test";
});

describe("buildSessionCookie", () => {
	assertCommonAttrs(() => buildSessionCookie("mytoken"));

	test("starts with session=, has HttpOnly", () => {
		const cookie = buildSessionCookie("mytoken");
		expect(cookie).toMatch(/^session=/);
		expect(cookie).toContain("HttpOnly");
	});
});

describe("clearSessionCookie", () => {
	test("targets the session cookie with Max-Age=0", () => {
		const cookie = clearSessionCookie();
		expect(cookie).toMatch(/^session=/);
		expect(cookie).toContain("Max-Age=0");
	});
});

describe("buildIndicatorCookie", () => {
	assertCommonAttrs(() => buildIndicatorCookie());

	test("starts with logged_in=, has no HttpOnly", () => {
		const cookie = buildIndicatorCookie();
		expect(cookie).toMatch(/^logged_in=/);
		expect(cookie).not.toContain("HttpOnly");
	});
});

describe("clearIndicatorCookie", () => {
	test("targets logged_in with Max-Age=0 and no HttpOnly", () => {
		const cookie = clearIndicatorCookie();
		expect(cookie).toMatch(/^logged_in=/);
		expect(cookie).toContain("Max-Age=0");
		expect(cookie).not.toContain("HttpOnly");
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
