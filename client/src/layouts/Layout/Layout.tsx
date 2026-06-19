import { Link, Outlet, useNavigate } from "react-router";

import { useAuth } from "../../context/auth/index.ts";

export const Layout = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		await navigate("/login");
	};

	return (
		<>
			<header>
				<h1>Todo App</h1>
				<nav>
					<Link to="/">Home</Link>
					{user && <button onClick={handleLogout}>Log out</button>}
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
