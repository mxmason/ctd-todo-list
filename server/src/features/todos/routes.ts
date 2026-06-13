import { Router } from "express";
import { z } from "zod";

import { requireAuth } from "#features/auth/middleware.ts";
import { AppError } from "#lib/app-error.ts";

import {
	createTodo,
	createManyTodos,
	deleteTodo,
	listTodos,
	setTodoCompleted,
} from "./store.ts";

const newTodo = z.object({ title: z.string().min(1).max(200) });
const patchTodo = z.object({ completed: z.boolean() });

const notFound = (): AppError =>
	new AppError(404, "not_found", "todo not found");

export const todoRoutes = Router();

todoRoutes.use(requireAuth);

todoRoutes.get("/", async (req, res) => {
	res.json(await listTodos(req.user!.id));
});

todoRoutes.post("/", async (req, res) => {
	if (Array.isArray(req.body)) {
		const titles = req.body.map((item) => {
			const { title } = newTodo.parse(item);
			return title;
		});
		return res.status(201).json(await createManyTodos(req.user!.id, titles));
	}
	const { title } = newTodo.parse(req.body);
	res.status(201).json(await createTodo(req.user!.id, title));
});

todoRoutes.patch("/:id", async (req, res) => {
	const { completed } = patchTodo.parse(req.body);
	const todo = await setTodoCompleted(req.user!.id, req.params.id, completed);
	if (!todo) throw notFound();
	res.json(todo);
});

todoRoutes.delete("/:id", async (req, res) => {
	const todo = await deleteTodo(req.user!.id, req.params.id);
	if (!todo) throw notFound();
	res.status(204).end();
});
