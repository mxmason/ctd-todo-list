import { defineConfig } from "vitest/config";

// Load server/.env so TEST_DATABASE_URL is available here and in global setup.
// Best-effort: in CI there's no .env and these come from real environment vars.
try {
	process.loadEnvFile(".env");
} catch {
	/* no .env present — rely on the real environment */
}

const databaseUrl = process.env.TEST_DATABASE_URL;
if (!databaseUrl) {
	throw new Error(
		"TEST_DATABASE_URL is not set (define it in server/.env or the environment)",
	);
}

export default defineConfig({
	test: {
		// Applied to worker processes before any module (and thus the Prisma
		// client) is imported, so tests talk to the throwaway test database.
		env: { DATABASE_URL: databaseUrl },
		globalSetup: ["./vitest.global-setup.ts"],
		// Serialize files so DB-truncating suites don't race on a shared database.
		fileParallelism: false,
	},
});
