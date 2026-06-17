import { Router } from "express";

import { AppError } from "#lib/app-error.ts";

import { buildIndicatorCookie, buildSessionCookie } from "./cookie.ts";
import { signToken } from "./crypto.ts";
import { getGoogleAuthUrl, getGoogleProfile } from "./google.ts";
import {
	createGoogleUser,
	findUserByEmail,
	findUserByGoogleId,
	linkGoogleAccount,
} from "./store.ts";

export const authRoutes = Router();

authRoutes.get("/google", (_req, res) => {
	res.redirect(getGoogleAuthUrl());
});

authRoutes.get("/google/callback", async (req, res) => {
	const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:3000";

	if (req.query["error"]) {
		return res.redirect(`${clientOrigin}/oauth/callback?error=1`);
	}

	const code = req.query["code"];
	if (typeof code !== "string" || !code) {
		throw new AppError(400, "invalid_argument", "missing OAuth code");
	}

	const { googleId, email } = await getGoogleProfile(code);

	let user =
		(await findUserByGoogleId(googleId)) ?? (await findUserByEmail(email));

	if (!user) {
		user = await createGoogleUser(googleId, email);
	} else if (!user.googleId) {
		user = await linkGoogleAccount(user.id, googleId, email);
	}

	res.setHeader("Set-Cookie", [
		buildSessionCookie(await signToken(user.id)),
		buildIndicatorCookie(),
	]);

	res.redirect(`${clientOrigin}/oauth/callback`);
});
