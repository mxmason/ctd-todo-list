import * as React from "react";

import { isApiError } from "#api/utils.ts";
import * as usersHooks from "#hooks/users.ts";
import { useUser } from "#hooks/users.ts";

import { AuthContext } from "./context.ts";

function hasSessionIndicator(): boolean {
	return document.cookie
		.split(";")
		.some((c) => c.trim().startsWith("logged_in="));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [shouldFetchUser, setShouldFetchUser] =
		React.useState(hasSessionIndicator);
	const { user, error, loading, refetch } = useUser(shouldFetchUser);

	React.useEffect(() => {
		// Only an HTTP-level auth failure means the session is invalid.
		// A raw network/abort error (e.g. the Google OAuth popup's own
		// AuthProvider instance getting its /me request cut off by
		// `window.close()`) says nothing about session validity and must not
		// wipe a cookie a concurrent successful login just set.
		if (!isApiError(error)) return;
		// Stale indicator (session expired/secret rotated) — clear it so the
		// next page load doesn't make a wasted /me round-trip.
		document.cookie = "logged_in=; Max-Age=0; Path=/; SameSite=Strict";
	}, [error]);

	const login: typeof usersHooks.login = async (creds) => {
		const result = await usersHooks.login(creds);
		if (result.error === null) setShouldFetchUser(true);
		return result;
	};

	const register: typeof usersHooks.register = async (creds) => {
		const result = await usersHooks.register(creds);
		if (result.error === null) setShouldFetchUser(true);
		return result;
	};

	const logout = async () => {
		await usersHooks.logout();
		setShouldFetchUser(false);
	};

	// The Google OAuth popup sets the session cookie out-of-band, so this must
	// force a re-fetch even when `shouldFetchUser` is already true.
	const refreshUser = async () => {
		if (shouldFetchUser) {
			await refetch();
		} else {
			setShouldFetchUser(true);
		}
	};

	return (
		<AuthContext
			value={{ user, isLoading: loading, login, logout, register, refreshUser }}
		>
			{children}
		</AuthContext>
	);
}
