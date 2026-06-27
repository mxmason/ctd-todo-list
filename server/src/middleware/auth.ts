import type { RequestHandler } from "express";

import { readSessionCookie } from "#features/users/cookie.ts";
import { verifyToken } from "#features/users/crypto.ts";
import { authError } from "#features/users/errors.ts";

declare global {
	// oxlint-disable-next-line typescript/no-namespace
	namespace Express {
		interface Request {
			user?: { id: string };
		}
	}
}

export const requireAuth: RequestHandler = async (req, _res, next) => {
	const token = readSessionCookie(req);
	if (!token) {
		next(authError());
		return;
	}
	try {
		const { userId } = await verifyToken(token);
		req.user = { id: userId };
		next();
	} catch (err) {
		next(err);
	}
};
