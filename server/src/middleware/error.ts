import type { ErrorRequestHandler } from "express";
import { z } from "zod";

import { isAppError, type ErrorCode } from "#lib/app-error.ts";

/**
 * Shape of every JSON error body the API returns.
 * `code` is checked against {@link ErrorCode}.
 */
export interface ErrorBody {
	code: ErrorCode;
	message: string;
	details?: unknown;
}

/** Match a body-parser error by its `type` tag (e.g. `entity.too.large`). */
const isBodyParserError = (err: unknown, type: string): err is Error =>
	err instanceof Error && "type" in err && err.type === type;

/**
 * Central error renderer.
 * Maps known error shapes to JSON. Everything else is a 500.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	// Any feature error built via AppError carries its own status + code.
	if (isAppError(err)) {
		return res
			.status(err.status)
			.json({ code: err.code, message: err.message } satisfies ErrorBody);
	}
	if (err instanceof z.ZodError) {
		return res.status(400).json({
			code: "invalid_argument",
			message: "request validation failed",
			details: z.treeifyError(err),
		} satisfies ErrorBody);
	}
	if (isBodyParserError(err, "entity.parse.failed")) {
		return res.status(400).json({
			code: "invalid_json",
			message: "malformed JSON body",
		} satisfies ErrorBody);
	}
	if (isBodyParserError(err, "entity.too.large")) {
		return res.status(413).json({
			code: "payload_too_large",
			message: "request body too large",
		} satisfies ErrorBody);
	}
	console.error(err);

	return res.status(500).json({
		code: "internal",
		message: "internal server error",
	} satisfies ErrorBody);
};
