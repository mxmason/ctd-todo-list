import type { RequestHandler } from "express";

import type { ErrorBody } from "./error.ts";

/** Terminal handler for requests that matched no route. */
export const notFound: RequestHandler = (req, res) => {
	res.status(404).json({
		code: "not_found",
		message: `no route for ${req.method} ${req.path}`,
	} satisfies ErrorBody);
};
