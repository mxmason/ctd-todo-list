import { describe, expect, test } from "vitest";

import { agent as makeAgent, api } from "#test/helpers.ts";

import { useTestDb } from "#test/db.ts";

// useTestDb truncates between tests, but a unique username per call keeps tests
// that register more than once self-contained.
let counter = 0;
function freshUser() {
	counter += 1;
	return { username: `user${counter}`, password: "supersecret" };
}

describe("users", () => {
	useTestDb();

	test("registers a new user", async () => {
		const user = freshUser();
		const res = await api().post("/api/users/register").send(user).expect(201);
		expect(res.body.username).toBe(user.username);
		expect(res.body.id).toEqual(expect.any(String));
		expect(res.body).not.toHaveProperty("passwordHash");
	});

	test("rejects a duplicate username with 409", async () => {
		const user = freshUser();
		await api().post("/api/users/register").send(user).expect(201);
		const res = await api().post("/api/users/register").send(user).expect(409);
		expect(res.body.code).toBe("conflict");
	});

	test("rejects a too-short password with 400", async () => {
		const res = await api()
			.post("/api/users/register")
			.send({ username: "shortpw", password: "tiny" })
			.expect(400);
		expect(res.body.code).toBe("invalid_argument");
	});

	test("login with bad password returns generic 401", async () => {
		const user = freshUser();
		await api().post("/api/users/register").send(user).expect(201);
		const res = await api()
			.post("/api/users/login")
			.send({ username: user.username, password: "wrongpassword" })
			.expect(401);
		expect(res.body).toEqual({
			code: "unauthenticated",
			message: "invalid username or password",
		});
	});

	test("login with unknown user returns the same generic 401", async () => {
		const res = await api()
			.post("/api/users/login")
			.send({ username: "nobody-here", password: "supersecret" })
			.expect(401);
		expect(res.body.message).toBe("invalid username or password");
	});

	test("protected route is blocked without a session", async () => {
		const res = await api().get("/api/todos").expect(401);
		expect(res.body.code).toBe("unauthenticated");
	});

	test("never exposes passwordHash on any user response", async () => {
		const user = freshUser();
		const agent = makeAgent();

		const register = await agent
			.post("/api/users/register")
			.send(user)
			.expect(201);
		expect(register.body).not.toHaveProperty("passwordHash");

		const login = await agent.post("/api/users/login").send(user).expect(200);
		expect(login.body).not.toHaveProperty("passwordHash");

		const me = await agent.get("/api/users/me").expect(200);
		expect(me.body).not.toHaveProperty("passwordHash");
	});

	test("login grants access to protected routes, logout revokes it", async () => {
		const user = freshUser();
		const agent = makeAgent(); // persists the session cookie
		await agent.post("/api/users/register").send(user).expect(201);

		const login = await agent.post("/api/users/login").send(user).expect(200);
		expect(login.headers["set-cookie"][0]).toMatch(/HttpOnly/);
		expect(login.headers["set-cookie"][0]).toMatch(/SameSite=Strict/);

		const todos = await agent.get("/api/todos").expect(200);
		expect(Array.isArray(todos.body)).toBe(true);

		const me = await agent.get("/api/users/me").expect(200);
		expect(me.body.username).toBe(user.username);

		await agent.post("/api/users/logout").expect(204);
		await agent.get("/api/todos").expect(401);
	});

	test("a tampered token is rejected", async () => {
		const res = await api()
			.get("/api/todos")
			.set("Cookie", "session=not.a.real.token")
			.expect(401);
		expect(res.body.code).toBe("unauthenticated");
	});
});
