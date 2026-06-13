import { Prisma } from "#generated/prisma/client.ts";
import { prisma } from "#lib/prisma.ts";

import { duplicateUserError } from "./errors.ts";

export const findUserByUsername = (username: string) =>
	prisma.user.findUnique({ where: { username } });

export const findUserById = (id: string) =>
	prisma.user.findUnique({ where: { id } });

export async function createUser(username: string, passwordHash: string) {
	try {
		return await prisma.user.create({ data: { username, passwordHash } });
	} catch (err) {
		// P2002 is Prisma's unique-constraint violation
		if (
			err instanceof Prisma.PrismaClientKnownRequestError &&
			err.code === "P2002"
		) {
			throw duplicateUserError(username);
		}
		throw err;
	}
}
