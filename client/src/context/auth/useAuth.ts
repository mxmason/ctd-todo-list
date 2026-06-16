import { use } from "react";

import { AuthContext, type AuthContextValue } from "./context.ts";

export function useAuth(): AuthContextValue {
	const ctx = use(AuthContext);
	if (ctx === null) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
