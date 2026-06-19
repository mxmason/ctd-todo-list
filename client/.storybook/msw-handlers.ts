import { http, HttpResponse } from "msw";

import type { Todo, User } from "#shared/schemas";

export const mockUser: User = { id: "u1", username: "ada" };

export const mockTodos: Todo[] = [
	{
		id: "t1",
		title: "Buy milk",
		completed: false,
		createdAt: "2026-06-18T00:00:00.000Z",
		userId: "u1",
	},
	{
		id: "t2",
		title: "Walk the dog",
		completed: true,
		createdAt: "2026-06-17T00:00:00.000Z",
		userId: "u1",
	},
];

// Default handlers shared across stories. Individual stories override
// these via `parameters.msw.handlers` when they need a different response.
export const handlers = [
	http.get("/api/users/me", () => HttpResponse.json(mockUser)),
	http.get("/api/todos", () => HttpResponse.json(mockTodos)),
	http.post("/api/todos", async ({ request }) => {
		const body = (await request.json()) as { title: string };
		const created: Todo = {
			id: "t-new",
			title: body.title,
			completed: false,
			createdAt: "2026-06-18T12:00:00.000Z",
			userId: "u1",
		};
		return HttpResponse.json(created, { status: 201 });
	}),
	http.post("/api/users/login", () => HttpResponse.json(mockUser)),
	http.post("/api/users/register", () => HttpResponse.json(mockUser)),
	http.post("/api/users/logout", () => new HttpResponse(null, { status: 204 })),
];
