import * as React from "react";

import * as usersApi from "#api/users.ts";
import { type Result } from "#api/utils.ts";
import { type Credentials, type User } from "#shared/schemas";

import { AuthContext } from "./context.ts";

function hasSessionIndicator(): boolean {
	return document.cookie
		.split(";")
		.some((c) => c.trim().startsWith("logged_in="));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = React.useState<User | null>(null);
	const [isLoading, setIsLoading] = React.useState(hasSessionIndicator);

	React.useEffect(() => {
		if (!hasSessionIndicator()) return;

		usersApi.me().then((result) => {
			if (result.error === null) {
				setUser(result.data);
			} else {
				// Stale indicator (session expired/secret rotated) — clear it so the
				// next page load doesn't make a wasted /me round-trip.
				document.cookie = "logged_in=; Max-Age=0; Path=/; SameSite=Strict";
			}
			setIsLoading(false);
		});
	}, []);

	const login = async (creds: Credentials): Promise<Result<User>> => {
		const result = await usersApi.login(creds);
		if (result.error === null) setUser(result.data);
		return result;
	};

	const logout = async () => {
		await usersApi.logout();
		setUser(null);
	};

	const register = async (creds: Credentials): Promise<Result<User>> => {
		const registerResult = await usersApi.register(creds);
		if (registerResult.error !== null) return registerResult;
		return login(creds);
	};

	return (
		<AuthContext value={{ user, isLoading, login, logout, register }}>
			{children}
		</AuthContext>
	);
}
