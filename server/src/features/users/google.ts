import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI,
);

const SCOPES = ["openid", "email"];

export function getGoogleAuthUrl(): string {
	return client.generateAuthUrl({
		access_type: "online",
		scope: SCOPES,
		prompt: "select_account",
	});
}

export async function getGoogleProfile(
	code: string,
): Promise<{ googleId: string; email: string }> {
	const { tokens } = await client.getToken(code);
	if (!tokens.access_token)
		throw new Error("no access_token in Google response");

	const info = await client.getTokenInfo(tokens.access_token);
	if (!info.sub || !info.email)
		throw new Error("Google token missing sub or email");

	return { googleId: info.sub, email: info.email };
}
