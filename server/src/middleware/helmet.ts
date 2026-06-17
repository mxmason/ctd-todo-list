import type { RequestHandler } from "express";

/**
 * Lock down some HTTP headers to mitigate common web vulnerabilities.
 * Same policy as {@link https://helmet.js.org/ | Helmet}'s defaults,
 * except we skip the `X-DNS-Prefetch-Control` and `X-Download-Options` headers
 * since they aren't relevant to our API server.
 * We also set a more restrictive Content Security Policy
 * since we don't serve any content that needs to load resources
 * from other origins.
 */
export const helmet: RequestHandler = (_req, res, next) => {
	res.removeHeader("X-Powered-By");
	res.set({
		"Content-Security-Policy": [
			"default-src 'none'",
			"script-src 'self'",
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data:",
			"font-src 'self'",
			"connect-src 'self'",
			"frame-ancestors 'none'",
			"base-uri 'self'",
			"form-action 'self'",
		].join("; "),
		"Cross-Origin-Resource-Policy": "same-origin",
		"Referrer-Policy": "no-referrer",
		"Strict-Transport-Security": "max-age=31536000; includeSubDomains",
		"X-Content-Type-Options": "nosniff",
	});
	next();
};
