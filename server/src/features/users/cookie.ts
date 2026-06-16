import type { Request } from "express";

import { SESSION_TTL_SECONDS } from "./crypto.ts";

const COOKIE_NAME = "session";
const INDICATOR_COOKIE_NAME = "logged_in";

export function readSessionCookie(req: Request): string | null {
	const header = req.headers.cookie;
	if (!header) return null;
	for (const part of header.split(";")) {
		const eq = part.indexOf("=");
		if (eq === -1) continue;
		const name = part.slice(0, eq).trim();
		if (name === COOKIE_NAME) {
			return decodeURIComponent(part.slice(eq + 1).trim());
		}
	}
	return null;
}

export function buildSessionCookie(token: string): string {
	return serialize(COOKIE_NAME, encodeURIComponent(token), SESSION_TTL_SECONDS);
}

export function clearSessionCookie(): string {
	return serialize(COOKIE_NAME, "", 0);
}

export function buildIndicatorCookie(): string {
	return serialize(INDICATOR_COOKIE_NAME, "1", SESSION_TTL_SECONDS, false);
}

export function clearIndicatorCookie(): string {
	return serialize(INDICATOR_COOKIE_NAME, "", 0, false);
}

function serialize(
	name: string,
	value: string,
	maxAge: number,
	httpOnly = true,
): string {
	const attrs = [
		`${name}=${value}`,
		...(httpOnly ? ["HttpOnly"] : []),
		"SameSite=Strict",
		"Path=/",
		`Max-Age=${maxAge}`,
	];
	// `Secure` blocks the cookie over plain HTTP, which breaks localhost dev.
	if (process.env.NODE_ENV === "production") attrs.push("Secure");
	return attrs.join("; ");
}
