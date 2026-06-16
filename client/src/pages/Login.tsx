import * as React from "react";
import { Link, Navigate, useNavigate } from "react-router";

import { useAuth } from "../context/auth/index.ts";

export function Login() {
	const { user, login } = useAuth();
	const navigate = useNavigate();
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");

	if (user) return <Navigate to="/" replace />;

	const handleSubmit = async (evt: React.SubmitEvent) => {
		evt.preventDefault();
		const result = await login({ username, password });
		if (result.error === null) await navigate("/");
	};

	return (
		<form onSubmit={handleSubmit}>
			<label>
				Username
				<input
					type="text"
					value={username}
					onChange={(evt) => setUsername(evt.target.value)}
					required
				/>
			</label>
			<label>
				Password
				<input
					type="password"
					value={password}
					onChange={(evt) => setPassword(evt.target.value)}
					required
				/>
			</label>
			<button type="submit">Log in</button>
			<p>
				No account? <Link to="/register">Register</Link>
			</p>
		</form>
	);
}
