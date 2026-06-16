import * as React from "react";

import { createTodo, getTodos } from "#api/todos.ts";
import { type Todo } from "#shared/schemas";

import { useApiRequest } from "./useApiRequest.ts";

export const useTodos = () => {
	const { run, ...rest } = useApiRequest<Todo[]>(true);

	React.useEffect(() => {
		run(getTodos());
	}, [run]);

	return rest;
};

export const useCreateTodo = () => {
	const { run, ...rest } = useApiRequest<Todo>();

	const create = (title: string) => run(createTodo(title));

	return { create, ...rest };
};
