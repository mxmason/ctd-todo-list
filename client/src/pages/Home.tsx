import { useTodos } from "#hooks/todos.ts";

export function Home() {
	const { data: todos, error, loading } = useTodos();

	return (
		<>
			<h2>My list</h2>
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
