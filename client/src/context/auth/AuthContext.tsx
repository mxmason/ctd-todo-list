import { useEffect, useState, type ReactNode } from "react";

import * as usersApi from "#api/users.ts";
import { type Result } from "#api/utils.ts";
import { type Credentials, type User } from "#shared/schemas";

import { AuthContext } from "./context.ts";

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		usersApi.me().then((result) => {
			if (result.error === null) setUser(result.data);
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
