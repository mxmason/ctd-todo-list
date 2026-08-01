import { vi } from "vitest";

import {
	afterEach,
	describe,
	expect,
	stubEnv,
	test,
} from "#test/test-utils.ts";

const jwtVerify = vi.fn();
vi.mock("jose", () => ({
	createRemoteJWKSet: vi.fn(() => "mock-jwks"),
	jwtVerify: (...args: unknown[]) => jwtVerify(...args),
}));

stubEnv({
	GOOGLE_CLIENT_ID: "test-client-id",
	GOOGLE_CLIENT_SECRET: "test-client-secret",
	GOOGLE_REDIRECT_URI: "https://app.example.com/callback",
});

afterEach(() => {
	vi.unstubAllGlobals();
	jwtVerify.mockReset();
});

describe("getGoogleAuthUrl", () => {
	test("builds the Google authorization URL from env config", async () => {
		const { getGoogleAuthUrl } = await import("./google.ts");
		const url = new URL(getGoogleAuthUrl());

		expect(url.origin + url.pathname).toBe(
			"https://accounts.google.com/o/oauth2/v2/auth",
		);
		expect(url.searchParams.get("client_id")).toBe("test-client-id");
		expect(url.searchParams.get("redirect_uri")).toBe(
			"https://app.example.com/callback",
		);
		expect(url.searchParams.get("response_type")).toBe("code");
		expect(url.searchParams.get("scope")).toBe("openid email");
		expect(url.searchParams.get("prompt")).toBe("select_account");
	});
});

describe("getGoogleProfile", () => {
	test("exchanges the code and returns googleId/email from the verified id_token", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({ id_token: "fake.id.token" }),
			}),
		);
		jwtVerify.mockResolvedValue({
			payload: { sub: "google-sub-123", email: "person@example.com" },
		});

		const { getGoogleProfile } = await import("./google.ts");
		const profile = await getGoogleProfile("auth-code");

		expect(profile).toEqual({
			googleId: "google-sub-123",
			email: "person@example.com",
		});

		const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
		expect(options.method).toBe("POST");
		const body = new URLSearchParams(options.body as string);
		expect(body.get("code")).toBe("auth-code");
		expect(body.get("grant_type")).toBe("authorization_code");

		expect(jwtVerify).toHaveBeenCalledWith(
			"fake.id.token",
			"mock-jwks",
			expect.objectContaining({ audience: "test-client-id" }),
		);
	});

	test("throws when the token exchange request fails", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }),
		);

		const { getGoogleProfile } = await import("./google.ts");
		await expect(getGoogleProfile("bad-code")).rejects.toThrow();
	});

	test("throws when the token response has no id_token", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }),
		);

		const { getGoogleProfile } = await import("./google.ts");
		await expect(getGoogleProfile("auth-code")).rejects.toThrow(/id_token/);
	});

	test("throws when the verified payload is missing sub or email", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({ id_token: "fake.id.token" }),
			}),
		);
		jwtVerify.mockResolvedValue({ payload: { sub: "google-sub-123" } });

		const { getGoogleProfile } = await import("./google.ts");
		await expect(getGoogleProfile("auth-code")).rejects.toThrow(/sub or email/);
	});

	test("propagates JWKS/signature verification failures", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({ id_token: "fake.id.token" }),
			}),
		);
		jwtVerify.mockRejectedValue(new Error("signature verification failed"));

		const { getGoogleProfile } = await import("./google.ts");
		await expect(getGoogleProfile("auth-code")).rejects.toThrow(
			/signature verification failed/,
		);
	});
});
