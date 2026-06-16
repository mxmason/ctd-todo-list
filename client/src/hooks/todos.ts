import * as React from "react";

import { getTodos } from "#api/todos.ts";
import type { ApiError } from "#api/utils.ts";
import { type Todo } from "#shared/schemas";

export const useTodos = () => {
	const [data, setData] = React.useState<Todo[] | null>(null);
	const [error, setError] = React.useState<ApiError | null>(null);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		getTodos().then((result) => {
			if (result.error === null) {
				setData(result.data);
			} else {
				setError(result.error);
				console.error("failed to fetch todos", result.error);
			}
			setLoading(false);
		});
	}, []);

	return {
		data,
		error,
		loading,
	};
};
