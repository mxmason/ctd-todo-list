import type { RequestHandler } from "express";

/**
 * Log incoming requests and their responses in a format similar to the
 * Apache combined log format, but with response time and content length instead
 * of referrer and user agent (since those aren't relevant for an API server).
 *
 * Similar to {@link https://github.com/expressjs/morgan | morgan}'s
 * `'dev'` format.
 */
export const requestLogger: RequestHandler = (req, res, next) => {
	const start = process.hrtime.bigint();

	res.on("finish", () => {
		const ms = Number(process.hrtime.bigint() - start) / 1e6;
		const length = res.getHeader("content-length") ?? "-";
		const color = statusColor(res.statusCode);
		const status = color
			? `\x1b[${color}m${res.statusCode}\x1b[0m`
			: String(res.statusCode);
		console.log(
			`${req.method} ${req.originalUrl} ${status} ${ms.toFixed(3)} ms - ${length}`,
		);
	});

	next();
};

// Status-code coloring, matching morgan's dev preset.
function statusColor(status: number): number {
	if (status >= 500) return 31; // red
	if (status >= 400) return 33; // yellow
	if (status >= 300) return 36; // cyan
	if (status >= 200) return 32; // green
	return 0; // no color
}
