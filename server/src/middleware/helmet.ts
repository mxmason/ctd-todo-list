import type { RequestHandler } from "express";

// A JSON API loads no resources and renders no markup, so lock everything down.
// Same security posture as helmet for our use case, minus the dependency.
export const helmet: RequestHandler = (_req, res, next) => {
	res.setHeader(
		"Content-Security-Policy",
		"default-src 'none'; frame-ancestors 'none'",
	);
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("Referrer-Policy", "no-referrer");
	res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
	res.setHeader(
		"Strict-Transport-Security",
		"max-age=31536000; includeSubDomains",
	);
	next();
};
