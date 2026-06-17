import { Navigate, Outlet } from "react-router";

import { useAuth } from "#context/auth/index.ts";

export function PublicRoute() {
	const { user, isLoading } = useAuth();
	if (isLoading) return null;
	if (user) return <Navigate to="/" replace />;
	return <Outlet />;
}
