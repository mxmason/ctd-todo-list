import { describe, expect, test } from "vitest";

import { seedUserSession, useTestDb } from "#/test-db.ts";
import { api } from "#test-helpers.ts";

describe("todos", () => {
	useTestDb();

	test("rejects unauthenticated access", async () => {
		await api().get("/api/todos").expect(401);
	});

	test("creates, lists, toggles, and deletes a todo", async () => {
		const { cookie } = await seedUserSession();

		const created = await api()
			.post("/api/todos")
			.set("Cookie", cookie)
			.send({ title: "buy milk" })
			.expect(201);
		expect(created.body).toMatchObject({ title: "buy milk", completed: false });

		const patched = await api()
			.patch(`/api/todos/${created.body.id}`)
			.set("Cookie", cookie)
			.send({ completed: true })
			.expect(200);
		expect(patched.body).toMatchObject({
			id: created.body.id,
			completed: true,
		});

		let list = await api().get("/api/todos").set("Cookie", cookie).expect(200);
		expect(list.body).toEqual([expect.objectContaining({ completed: true })]);

		await api()
			.delete(`/api/todos/${created.body.id}`)
			.set("Cookie", cookie)
			.expect(204);

		list = await api().get("/api/todos").set("Cookie", cookie).expect(200);
		expect(list.body).toHaveLength(0);
	});

	test("does not leak or mutate another user's todos", async () => {
		const alice = await seedUserSession("alice");
		const bob = await seedUserSession("bob");

		const todo = await api()
			.post("/api/todos")
			.set("Cookie", alice.cookie)
			.send({ title: "alice-only" })
			.expect(201);

		const bobList = await api()
			.get("/api/todos")
			.set("Cookie", bob.cookie)
			.expect(200);
		expect(bobList.body).toHaveLength(0);

		await api()
			.patch(`/api/todos/${todo.body.id}`)
			.set("Cookie", bob.cookie)
			.send({ completed: true })
			.expect(404);
		await api()
			.delete(`/api/todos/${todo.body.id}`)
			.set("Cookie", bob.cookie)
			.expect(404);
	});

	test("rejects an empty title with 400", async () => {
		const { cookie } = await seedUserSession();
		const res = await api()
			.post("/api/todos")
			.set("Cookie", cookie)
			.send({ title: "" })
			.expect(400);
		expect(res.body.code).toBe("invalid_argument");
	});
});
