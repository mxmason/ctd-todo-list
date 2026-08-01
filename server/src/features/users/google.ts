import { createRemoteJWKSet, jwtVerify } from "jose";

import { authError } from "./errors.ts";

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const JWKS_URI = "https://www.googleapis.com/oauth2/v3/certs";
const ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

const SCOPES = ["openid", "email"];

// Cached across requests; jose refetches keys internally on a kid miss.
const googleJwks = createRemoteJWKSet(new URL(JWKS_URI));

function clientId(): string {
	const value = process.env.GOOGLE_CLIENT_ID;
	if (!value) throw new Error("GOOGLE_CLIENT_ID is not set");
	return value;
}

function clientSecret(): string {
	const value = process.env.GOOGLE_CLIENT_SECRET;
	if (!value) throw new Error("GOOGLE_CLIENT_SECRET is not set");
	return value;
}

function redirectUri(): string {
	const value = process.env.GOOGLE_REDIRECT_URI;
	if (!value) throw new Error("GOOGLE_REDIRECT_URI is not set");
	return value;
}

export function getGoogleAuthUrl(): string {
	const params = new URLSearchParams({
		client_id: clientId(),
		redirect_uri: redirectUri(),
		response_type: "code",
		access_type: "online",
		scope: SCOPES.join(" "),
		prompt: "select_account",
	});
	return `${AUTH_ENDPOINT}?${params.toString()}`;
}

export async function getGoogleProfile(
	code: string,
): Promise<{ googleId: string; email: string }> {
	const tokenRes = await fetch(TOKEN_ENDPOINT, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			code,
			client_id: clientId(),
			client_secret: clientSecret(),
			grant_type: "authorization_code",
			redirect_uri: redirectUri(),
		}),
	});
	if (!tokenRes.ok) throw authError("Google token exchange failed");

	const tokens = (await tokenRes.json()) as { id_token?: string };
	if (!tokens.id_token) throw authError("no id_token in Google response");

	// jwtVerify checks the RS256 signature against Google's published JWKS,
	// so this isn't hand-rolled JWT validation.
	const { payload } = await jwtVerify(tokens.id_token, googleJwks, {
		issuer: ISSUERS,
		audience: clientId(),
	});

	if (typeof payload.sub !== "string" || typeof payload["email"] !== "string")
		throw authError("Google token missing sub or email");

	return { googleId: payload.sub, email: payload["email"] };
}
