import { createContext } from "react";

import type { Result } from "#api/utils.ts";
import type { Credentials, User } from "#shared/schemas";

export interface AuthContextValue {
	user: User | null;
	isLoading: boolean;
	login: (creds: Credentials) => Promise<Result<User>>;
	logout: () => Promise<void>;
	register: (creds: Credentials) => Promise<Result<User>>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
