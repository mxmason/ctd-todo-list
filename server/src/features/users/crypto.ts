import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

import { jwtVerify, SignJWT } from "jose";

import { isAppError } from "#lib/app-error.ts";

import { authError } from "./errors.ts";

const scryptAsync = promisify(scrypt);

const SALT_BYTES = 16;
const KEY_BYTES = 64;

export const SESSION_TTL_SECONDS = 60 * 60; // 1 hour

const JWT_ALG = "HS256";
const AUTH_SECRET = resolveSecret();

// jose wants the HS256 secret as bytes; encode once at module load.
const SIGNING_KEY = new TextEncoder().encode(AUTH_SECRET);

/** Hash a password with a per-user random salt.
 * Returns `"<saltHex>:<hashHex>"`.
 */
export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(SALT_BYTES);
	const derived = (await scryptAsync(password, salt, KEY_BYTES)) as Buffer;
	return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPassword(
	password: string,
	stored: string,
): Promise<boolean> {
	const [saltHex, hashHex] = stored.split(":");
	if (!saltHex || !hashHex) return false;

	const salt = Buffer.from(saltHex, "hex");
	const expected = Buffer.from(hashHex, "hex");
	const derived = (await scryptAsync(
		password,
		salt,
		expected.length,
	)) as Buffer;

	// timingSafeEqual throws on length mismatch, so guard first.
	if (derived.length !== expected.length) return false;
	return timingSafeEqual(derived, expected);
}

export function signToken(userId: string): Promise<string> {
	return new SignJWT({})
		.setProtectedHeader({ alg: JWT_ALG })
		.setSubject(userId)
		.setIssuedAt()
		.setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS)
		.sign(SIGNING_KEY);
}

export async function verifyToken(token: string): Promise<{ userId: string }> {
	try {
		// Pinning the algorithm blocks the classic `alg:none` / alg-confusion JWT attacks.
		const { payload } = await jwtVerify(token, SIGNING_KEY, {
			algorithms: [JWT_ALG],
		});
		if (!payload.sub) throw authError("malformed session token");
		return { userId: payload.sub };
	} catch (err) {
		if (isAppError(err)) throw err;
		throw authError("invalid session token");
	}
}

function resolveSecret(): string {
	const fromEnv = process.env.AUTH_SECRET;
	if (fromEnv) return fromEnv;
	if (process.env.NODE_ENV === "test") return "test-only-secret";
	if (process.env.NODE_ENV === "production") {
		throw new Error("AUTH_SECRET must be set in production");
	}
	// Dev convenience: random per-process secret. Sessions reset on restart.
	console.warn(
		"AUTH_SECRET not set — using an ephemeral dev secret (sessions reset on restart).",
	);
	return randomBytes(32).toString("hex");
}
