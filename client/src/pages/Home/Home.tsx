import { AddTodoForm } from "#components/AddTodoForm/index.ts";
import { useTodos } from "#hooks/todos.ts";

export function Home() {
	const { data: todos, error, loading, refetch } = useTodos();

	return (
		<>
			<h2>My list</h2>
			<AddTodoForm onSuccess={refetch} />
			{error && (
				<p style={{ color: "red" }}>Failed to load todos: {error.message}</p>
			)}
			{todos === null && loading ? (
				<p>Loading...</p>
			) : (
				<ul>
					{todos?.map((todo) => (
						<li key={todo.id}>
							{todo.title} {todo.completed ? "✓" : ""}
						</li>
					))}
				</ul>
			)}
		</>
	);
}
