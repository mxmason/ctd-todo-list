import { type Todo } from "#shared";

import { apiFetch } from "./utils.ts";

export const getTodos = () => apiFetch<Todo[]>("/todos");
