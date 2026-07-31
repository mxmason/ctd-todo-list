import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { unwrap } from "#api/swrFetcher.ts";
import { createTodo, getTodos } from "#api/todos.ts";
import type { ApiError } from "#api/utils.ts";
import { type Todo } from "#shared/schemas";

export const useTodos = () => {
	const { data, error, isLoading, mutate } = useSWR<Todo[], ApiError>(
		"/todos",
		() => unwrap(getTodos()),
	);

	return {
		data: data ?? null,
		error: error ?? null,
		loading: isLoading,
		refetch: () => mutate(),
	};
};

export const useCreateTodo = () => {
	const { data, error, isMutating, trigger } = useSWRMutation<
		Todo,
		ApiError,
		"/todos",
		string
	>("/todos", (_key, { arg: title }) => unwrap(createTodo(title)));

	const create = async (title: string): Promise<boolean> => {
		try {
			await trigger(title);
			return true;
		} catch {
			return false;
		}
	};

	return {
		data: data ?? null,
		error: error ?? null,
		loading: isMutating,
		create,
	};
};
