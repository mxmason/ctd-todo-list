import { randomUUID } from "node:crypto";

import { afterAll, afterEach } from "vitest";

import { signToken } from "#features/users/crypto.ts";
import { prisma } from "#lib/prisma.ts";

/**
 * Opt a test file into the real test database: truncates all tables between
 * tests for isolation and releases the connection when the file finishes. Call
 * it at the top of a describe block. Files that don't call this never touch the
 * database (the Prisma client connects lazily on first query).
 */
export function useTestDb(): void {
	afterEach(async () => {
		await prisma.$executeRawUnsafe(
			'TRUNCATE TABLE "todos", "users" RESTART IDENTITY CASCADE',
		);
	});
	afterAll(async () => {
		await prisma.$disconnect();
	});
}

/**
 * Seed a real users row and return a Cookie header authenticating as them.
 */
export async function seedUserSession(
	username = `user_${randomUUID().slice(0, 8)}`,
): Promise<{ user: { id: string; username: string }; cookie: string }> {
	const user = await prisma.user.create({
		data: { username, passwordHash: "seed:seed" },
	});
	return { user, cookie: `session=${await signToken(user.id)}` };
}
