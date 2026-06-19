import * as React from "react";
import { Link, useNavigate } from "react-router";

import { GoogleAuthButton } from "#components/GoogleAuthButton/index.ts";
import { useAuth } from "#context/auth/index.ts";

export function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");

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
			<GoogleAuthButton />
			<p>
				No account? <Link to="/register">Register</Link>
			</p>
		</form>
	);
}
