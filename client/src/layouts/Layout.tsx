import { Link, Outlet } from "react-router";

export const Layout = () => {
	return (
		<>
			<header>
				<h1>Todo App</h1>
				<nav>
					<Link to="/">Home</Link>
				</nav>
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
