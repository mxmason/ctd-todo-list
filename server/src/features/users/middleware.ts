import type { RequestHandler } from "express";

import { readSessionCookie } from "./cookie.ts";
import { verifyToken } from "./crypto.ts";
import { authError } from "./errors.ts";

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
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
