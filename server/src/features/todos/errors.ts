import { AppError } from "#lib/app-error.ts";

export const todoNotFound = (): AppError =>
	new AppError(404, "not_found", "todo not found");
