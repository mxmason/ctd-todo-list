import { Outlet } from "react-router";

export const Layout = () => {
	return (
		<>
			<header>
				<h1>Todo App</h1>
			</header>
			<main>
				<Outlet />
			</main>
			<footer>
				<p>&copy; 2026 My Todo App</p>
			</footer>
		</>
	);
};
