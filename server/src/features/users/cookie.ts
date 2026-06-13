import type { Request } from "express";

import { SESSION_TTL_SECONDS } from "./crypto.ts";

const COOKIE_NAME = "session";

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
	return serialize(encodeURIComponent(token), SESSION_TTL_SECONDS);
}

export function clearSessionCookie(): string {
	return serialize("", 0);
}

function serialize(value: string, maxAge: number): string {
	const attrs = [
		`${COOKIE_NAME}=${value}`,
		"HttpOnly", // unreadable by JS — XSS can't steal it
		"SameSite=Strict", // CSRF protection without a token
		"Path=/",
		`Max-Age=${maxAge}`,
	];
	// `Secure` blocks the cookie over plain HTTP, which breaks localhost dev.
	if (process.env.NODE_ENV === "production") attrs.push("Secure");
	return attrs.join("; ");
}
