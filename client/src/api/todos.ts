import { type Todo } from "#shared";

import { apiFetch } from "./utils.ts";

export const getTodos = () => apiFetch<Todo[]>("/todos");

export const createTodo = (title: string) =>
	apiFetch<Todo>("/todos", {
		method: "POST",
		body: JSON.stringify({ title }),
	});

export const setTodoCompleted = (id: string, completed: boolean) =>
	apiFetch<Todo>(`/todos/${id}`, {
		method: "PATCH",
		body: JSON.stringify({ completed }),
	});

export const deleteTodo = (id: string) =>
	apiFetch(`/todos/${id}`, {
		method: "DELETE",
	});
