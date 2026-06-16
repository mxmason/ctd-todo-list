import { Router } from "express";

import { validate } from "#lib/app-error.ts";
import { requireAuth } from "#middleware/auth.ts";
import { newTodoSchema, patchTodoSchema } from "#shared/schemas";

import { todoNotFound } from "./errors.ts";
import {
	createTodo,
	createManyTodos,
	deleteTodo,
	listTodos,
	setTodoCompleted,
} from "./store.ts";

export const todoRoutes = Router();

todoRoutes.use(requireAuth);

todoRoutes.get("/", async (req, res) => {
	res.json(await listTodos(req.user!.id));
});

todoRoutes.post("/", async (req, res) => {
	if (Array.isArray(req.body)) {
		const titles = req.body.map((item) => {
			const { title } = validate(newTodoSchema, item);
			return title;
		});
		return res.status(201).json(await createManyTodos(req.user!.id, titles));
	}
	const { title } = validate(newTodoSchema, req.body);
	res.status(201).json(await createTodo(req.user!.id, title));
});

todoRoutes.patch("/:id", async (req, res) => {
	const { completed } = validate(patchTodoSchema, req.body);
	const todo = await setTodoCompleted(req.user!.id, req.params.id, completed);
	if (!todo) throw todoNotFound();
	res.json(todo);
});

todoRoutes.delete("/:id", async (req, res) => {
	const todo = await deleteTodo(req.user!.id, req.params.id);
	if (!todo) throw todoNotFound();
	res.status(204).end();
});
