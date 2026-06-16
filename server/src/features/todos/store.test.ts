import { randomUUID } from "node:crypto";

import { describe, expect, test } from "vitest";

import { prisma } from "#lib/prisma.ts";
import { seedUserSession, useTestDb } from "#test/db.ts";

import {
	createManyTodos,
	createTodo,
	deleteTodo,
	listTodos,
	setTodoCompleted,
} from "./store.ts";

describe("todos/store", () => {
	useTestDb();

	test("listTodos returns [] for a user with no todos", async () => {
		const { user } = await seedUserSession();
		expect(await listTodos(user.id)).toEqual([]);
	});

	test("listTodos returns todos in descending createdAt order", async () => {
		const { user } = await seedUserSession();
		const first = await createTodo(user.id, "first todo");
		// Back-date first todo so timestamps are strictly ordered despite fast test execution
		await prisma.todo.update({
			where: { id: first.id },
			data: { createdAt: new Date(Date.now() - 1000) },
		});
		const second = await createTodo(user.id, "second todo");
		const todos = await listTodos(user.id);
		expect(todos).toHaveLength(2);
		expect(todos[0].id).toBe(second.id);
		expect(todos[1].id).toBe(first.id);
	});

	test("listTodos does not return another user's todos", async () => {
		const alice = await seedUserSession();
		const bob = await seedUserSession();
		await createTodo(alice.user.id, "alice's todo");
		expect(await listTodos(bob.user.id)).toHaveLength(0);
	});

	test("createTodo returns a todo with id, userId, title, completed=false, createdAt", async () => {
		const { user } = await seedUserSession();
		const todo = await createTodo(user.id, "my task");
		expect(todo.id).toEqual(expect.any(String));
		expect(todo.userId).toBe(user.id);
		expect(todo.title).toBe("my task");
		expect(todo.completed).toBe(false);
		expect(todo.createdAt).toBeInstanceOf(Date);
	});

	test("createManyTodos returns a count object and todos exist in DB afterward", async () => {
		const { user } = await seedUserSession();
		expect(
			await createManyTodos(user.id, ["task a", "task b", "task c"]),
		).toEqual({ count: 3 });
		expect(await listTodos(user.id)).toHaveLength(3);
	});

	test("setTodoCompleted updates completed and returns the updated todo", async () => {
		const { user } = await seedUserSession();
		const todo = await createTodo(user.id, "finish me");
		const updated = await setTodoCompleted(user.id, todo.id, true);
		expect(updated?.id).toBe(todo.id);
		expect(updated?.completed).toBe(true);
	});

	test("setTodoCompleted returns null for a non-existent id", async () => {
		const { user } = await seedUserSession();
		expect(await setTodoCompleted(user.id, randomUUID(), true)).toBeNull();
	});

	test("setTodoCompleted returns null when todo belongs to a different user", async () => {
		const alice = await seedUserSession();
		const bob = await seedUserSession();
		const todo = await createTodo(alice.user.id, "alice's task");
		expect(await setTodoCompleted(bob.user.id, todo.id, true)).toBeNull();
	});

	test("deleteTodo deletes and returns the todo", async () => {
		const { user } = await seedUserSession();
		const todo = await createTodo(user.id, "to be deleted");
		const deleted = await deleteTodo(user.id, todo.id);
		expect(deleted?.id).toBe(todo.id);
		expect(await listTodos(user.id)).toHaveLength(0);
	});

	test("deleteTodo returns null for a non-existent id", async () => {
		const { user } = await seedUserSession();
		expect(await deleteTodo(user.id, randomUUID())).toBeNull();
	});

	test("deleteTodo returns null when todo exists but belongs to a different user", async () => {
		const alice = await seedUserSession();
		const bob = await seedUserSession();
		const todo = await createTodo(alice.user.id, "alice's only task");
		expect(await deleteTodo(bob.user.id, todo.id)).toBeNull();
		expect(await listTodos(alice.user.id)).toHaveLength(1);
	});
});
