import type { ErrorRequestHandler } from "express";

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

const bodyParserErrors: Partial<Record<string, [number, ErrorCode, string]>> = {
	"entity.parse.failed": [400, "invalid_json", "malformed JSON body"],
	"entity.too.large": [413, "payload_too_large", "request body too large"],
};

/**
 * Central error renderer.
 * Maps known error shapes to JSON. Everything else is a 500.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
	// If streaming has already started, delegate to Express's default handler.
	if (res.headersSent) {
		return next(err);
	}

	// Any feature error built via AppError carries its own status + code.
	if (isAppError(err)) {
		const errJson = {
			code: err.code,
			details: err.details,
			message: err.message,
		} satisfies ErrorBody;

		if (err.details === undefined) delete errJson.details;

		return res.status(err.status).json(errJson);
	}
	if (err instanceof Error && "type" in err) {
		const entry = bodyParserErrors[err.type as string];
		if (entry) {
			const [status, code, message] = entry;
			return res.status(status).json({ code, message } satisfies ErrorBody);
		}
	}
	console.error(err);

	return res.status(500).json({
		code: "internal",
		message: "internal server error",
	} satisfies ErrorBody);
};
