import { loadEnvFile } from "node:process";

import { defineConfig, env } from "prisma/config";

// Prisma's CLI stops auto-loading `.env` once this config file exists, so load it
// here the same way vitest.config.ts does — Node's built-in loader, no dotenv.
// Best-effort: in CI there's no .env and the vars come from the real environment.
// loadEnvFile never overrides vars already set, so the test runner's DATABASE_URL
// override still wins.
try {
	loadEnvFile(".env");
} catch {
	/* no .env present — rely on the real environment */
}

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
	},
	// In Prisma 7 the CLI/migrations read the connection URL from here (the schema
	// datasource no longer carries it). The runtime client connects via the pg
	// driver adapter in src/lib/prisma.ts instead.
	datasource: {
		url: env("DATABASE_URL"),
	},
});
