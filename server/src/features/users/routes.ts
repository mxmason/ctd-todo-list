import { Router } from "express";

import { credentialsSchema } from "#shared/schemas";

import { buildSessionCookie, clearSessionCookie } from "./cookie.ts";
import { hashPassword, signToken, verifyPassword } from "./crypto.ts";
import { authError } from "./errors.ts";
import { requireAuth } from "./middleware.ts";
import { createUser, findUserById, findUserByUsername } from "./store.ts";

// Public projection of a user — keeps passwordHash from ever reaching a client.
const toPublicUser = ({ id, username }: { id: string; username: string }) => ({
	id: id,
	username: username,
});

// Memoized dummy hash so login spends the same time whether or not the user
// exists — avoids leaking which usernames are registered via response timing.
let dummyHash: Promise<string> | null = null;
function timingDecoyHash(): Promise<string> {
	dummyHash ??= hashPassword("timing-decoy-password");
	return dummyHash;
}

export const userRoutes = Router();

userRoutes.post("/register", async (req, res) => {
	const { username, password } = credentialsSchema.parse(req.body);
	const passwordHash = await hashPassword(password);
	res.status(201).json(toPublicUser(await createUser(username, passwordHash)));
});

userRoutes.post("/login", async (req, res) => {
	const { username, password } = credentialsSchema.parse(req.body);
	const user = await findUserByUsername(username);
	const hash = user?.passwordHash ?? (await timingDecoyHash());
	const ok = await verifyPassword(password, hash);
	// Same error for unknown user and wrong password — no enumeration.
	if (!user || !ok) throw authError("invalid username or password");
	res.setHeader("Set-Cookie", buildSessionCookie(await signToken(user.id)));
	res.json(toPublicUser(user));
});

userRoutes.post("/logout", (_req, res) => {
	res.setHeader("Set-Cookie", clearSessionCookie());
	res.status(204).end();
});

userRoutes.get("/me", requireAuth, async (req, res) => {
	const user = req.user && (await findUserById(req.user.id));
	if (!user) throw authError("session user no longer exists");
	res.json(toPublicUser(user));
});
