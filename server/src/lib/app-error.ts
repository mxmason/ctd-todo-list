import { z } from "zod";

export type ErrorCode =
	| "conflict"
	| "internal"
	| "invalid_argument"
	| "invalid_json"
	| "not_found"
	| "payload_too_large"
	| "unauthenticated";

/**
 * Carrier for errors that map to a specific HTTP response.
 * The central errorHandler renders any AppError
 * from its `status`/`code`/`message`/`details`,
 * so feature modules can define their own errors.
 * Construct these via small factory functions (e.g. `authError()`)
 * rather than subclassing.
 */
export class AppError extends Error {
	readonly status: number;
	readonly code: ErrorCode;
	readonly details?: unknown;

	constructor(
		status: number,
		code: ErrorCode,
		message: string,
		details?: unknown,
	) {
		super(message);
		this.status = status;
		this.code = code;
		this.details = details;
		this.name = "AppError";
	}
}

export const isAppError = (err: unknown): err is AppError =>
	err instanceof AppError;

/**
 * Parse `data` with `schema`, throwing an `AppError` (invalid_argument)
 * instead of a raw ZodError so callers never need to handle both.
 */
export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
	const result = schema.safeParse(data);
	if (!result.success) {
		throw new AppError(
			400,
			"invalid_argument",
			"request validation failed",
			z.treeifyError(result.error),
		);
	}
	return result.data;
}
