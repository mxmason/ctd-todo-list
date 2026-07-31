import useSWR from "swr";

import { unwrap } from "#api/swrFetcher.ts";
import * as usersApi from "#api/users.ts";
import type { ApiError, Result } from "#api/utils.ts";
import type { Credentials, User } from "#shared/schemas";

export const USER_KEY = "/users/me";

export const useUser = (shouldFetch: boolean) => {
	const { data, error, isLoading, mutate } = useSWR<User, ApiError>(
		shouldFetch ? USER_KEY : null,
		() => unwrap(usersApi.me()),
	);

	return {
		user: data ?? null,
		error: error ?? null,
		loading: isLoading,
		refetch: () => mutate(),
	};
};

export const login = (creds: Credentials): Promise<Result<User>> =>
	usersApi.login(creds);

export const register = async (creds: Credentials): Promise<Result<User>> => {
	const result = await usersApi.register(creds);
	if (result.error !== null) return result;
	return login(creds);
};

export const logout = () => usersApi.logout();
