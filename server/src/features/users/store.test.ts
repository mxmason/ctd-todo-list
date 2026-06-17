import { randomUUID } from "node:crypto";

import { describe, expect, test } from "vitest";

import { isAppError } from "#lib/app-error.ts";
import { useTestDb } from "#test/db.ts";

import { createLocalUser, findUserById, findUserByUsername } from "./store.ts";

describe("users/store", () => {
	useTestDb();

	test("createUser returns an object with id, username, and passwordHash", async () => {
		const user = await createLocalUser("alice", "hash:abc");
		expect(user.id).toEqual(expect.any(String));
		expect(user.username).toBe("alice");
		expect(user.passwordHash).toBe("hash:abc");
	});

	test("createUser throws an AppError with status 409 and code 'conflict' on duplicate username", async () => {
		await createLocalUser("bob", "hash:1");
		expect.assertions(3);
		try {
			await createLocalUser("bob", "hash:2");
		} catch (err) {
			expect(isAppError(err)).toBe(true);
			if (isAppError(err)) {
				expect(err.status).toBe(409);
				expect(err.code).toBe("conflict");
			}
		}
	});

	test("findUserByUsername returns the user when it exists", async () => {
		await createLocalUser("carol", "hash:xyz");
		const found = await findUserByUsername("carol");
		expect(found).not.toBeNull();
		expect(found?.username).toBe("carol");
	});

	test("findUserByUsername returns null when username does not exist", async () => {
		expect(await findUserByUsername("nobody")).toBeNull();
	});

	test("findUserById returns the user when it exists", async () => {
		const created = await createLocalUser("dave", "hash:qrs");
		const found = await findUserById(created.id);
		expect(found).not.toBeNull();
		expect(found?.id).toBe(created.id);
		expect(found?.username).toBe("dave");
	});

	test("findUserById returns null when id does not exist", async () => {
		expect(await findUserById(randomUUID())).toBeNull();
	});
});
