import * as React from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "#context/auth/index.ts";

export function Register() {
	const { register } = useAuth();
	const navigate = useNavigate();
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");

	const handleSubmit = async (evt: React.SubmitEvent) => {
		evt.preventDefault();
		const result = await register({ username, password });
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
			<button type="submit">Register</button>
			<p>
				Already have an account? <Link to="/login">Log in</Link>
			</p>
		</form>
	);
}
