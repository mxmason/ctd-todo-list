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

app.use(notFound, errorHandler);
