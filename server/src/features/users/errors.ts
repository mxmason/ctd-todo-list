import { AppError } from "#lib/app-error.ts";

/**
 * Missing or invalid session. Rendered as 401 by {@link errorHandler}.
 */
export const authError = (message = "authentication required"): AppError =>
	new AppError(401, "unauthenticated", message);

/**
 * Registering a username that already exists. Rendered as 409 by {@link errorHandler}.
 */
export const duplicateUserError = (username: string): AppError =>
	new AppError(409, "conflict", `username "${username}" is already taken`);
