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
 * from its `status`/`code`/`message`,
 * so feature modules can define their own errors.
 * Construct these via small factory functions (e.g. `authError()`)
 * rather than subclassing.
 */
export class AppError extends Error {
	readonly status: number;
	readonly code: ErrorCode;

	constructor(status: number, code: ErrorCode, message: string) {
		super(message);
		this.status = status;
		this.code = code;
		this.name = "AppError";
	}
}

export const isAppError = (err: unknown): err is AppError =>
	err instanceof AppError;
