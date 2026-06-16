import * as React from "react";

import { useCreateTodo } from "#hooks/todos.ts";

export const AddTodoForm = ({ onSuccess }: { onSuccess?: () => void }) => {
	const [title, setTitle] = React.useState("");
	const { data, error, loading, create } = useCreateTodo();

	const handleSubmit = async (evt: React.SubmitEvent) => {
		evt.preventDefault();
		const ok = await create(title);
		if (ok) {
			setTitle("");
			onSuccess?.();
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="title">Title</label>
			<input
				id="title"
				type="text"
				value={title}
				onChange={(evt) => setTitle(evt.target.value)}
				required
			/>
			<button disabled={loading} type="submit">
				{loading ? "Adding…" : "Add"}
			</button>
			{error && <p role="alert">{error.message}</p>}
			{data && <p>Todo added!</p>}
		</form>
	);
};
