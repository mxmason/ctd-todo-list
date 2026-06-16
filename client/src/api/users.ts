import { type Credentials, type User } from "#shared/schemas";

import { apiFetch } from "./utils.ts";

export const me = () => apiFetch<User>("/users/me");

export const login = (body: Credentials) =>
	apiFetch<User>("/users/login", {
		method: "POST",
		body: JSON.stringify(body),
	});

export const register = (body: Credentials) =>
	apiFetch<User>("/users/register", {
		method: "POST",
		body: JSON.stringify(body),
	});

export const logout = () => apiFetch("/users/logout", { method: "POST" });
