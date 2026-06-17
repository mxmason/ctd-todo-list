import { join, resolve } from "node:path";

import cors from "cors";
import express from "express";

import { errorHandler } from "./middleware/error.ts";
import { helmet } from "./middleware/helmet.ts";
import { notFound } from "./middleware/not-found.ts";
import { requestLogger } from "./middleware/request-logger.ts";
import { router } from "./router.ts";

export const app = express();

if (process.env.NODE_ENV !== "test") {
	app.use(requestLogger);
}

app.use(
	helmet,
	// Restrict CORS to the known client origin. A wildcard origin is incompatible
	// with the credentialed (cookie-based) auth requests this API serves.
	cors({
		origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
		credentials: true,
	}),
	express.json({ limit: "10kb" }),
);

app.use("/api", router);

if (process.env.NODE_ENV === "production") {
	const clientDist = resolve(import.meta.dirname, "../../client/dist");
	app.use(express.static(clientDist));
	app.get("*path", (_req, res) => {
		res.sendFile(join(clientDist, "index.html"));
	});
}

app.use(notFound, errorHandler);
