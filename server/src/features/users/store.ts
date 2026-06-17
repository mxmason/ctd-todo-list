import { Prisma } from "#generated/prisma/client.ts";
import { prisma } from "#lib/prisma.ts";

import { duplicateUserError } from "./errors.ts";

export const findUserByUsername = (username: string) =>
	prisma.user.findUnique({ where: { username } });

export const findUserById = (id: string) =>
	prisma.user.findUnique({ where: { id } });

export const findUserByEmail = (email: string) =>
	prisma.user.findUnique({ where: { email } });

export const findUserByGoogleId = (googleId: string) =>
	prisma.user.findUnique({ where: { googleId } });

export const linkGoogleAccount = (
	userId: string,
	googleId: string,
	email: string,
) => prisma.user.update({ where: { id: userId }, data: { googleId, email } });

async function createUser(data: {
	username: string;
	passwordHash: string | null;
	googleId?: string;
	email?: string;
}) {
	try {
		return await prisma.user.create({ data });
	} catch (err) {
		if (
			err instanceof Prisma.PrismaClientKnownRequestError &&
			err.code === "P2002"
		) {
			throw duplicateUserError(data.username);
		}
		throw err;
	}
}

export const createLocalUser = (username: string, passwordHash: string) =>
	createUser({ username, passwordHash });

export const createGoogleUser = (googleId: string, email: string) =>
	createUser({ username: email, googleId, email, passwordHash: null });
