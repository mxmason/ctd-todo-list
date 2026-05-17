import { execSync } from "node:child_process";

/**
 * Runs once before the suite (in the main process). Recreates the throwaway test
 * database from scratch, then applies the current migrations to it. Starting from
 * an empty database (via dropdb/createdb — system tools, not Prisma) keeps the
 * harness immune to migration history changes (e.g. after `npm run db:flatten`)
 * and gives every run a clean schema, while `migrate deploy` stays non-destructive
 * so it never trips Prisma's safeguards. The test runner points DATABASE_URL at
 * this database (see vitest.config.ts).
 */
export default function setup(): void {
	const url = process.env.TEST_DATABASE_URL;
	if (!url) throw new Error("TEST_DATABASE_URL is not set");
	const dbName = new URL(url).pathname.slice(1);

	// Best-effort drop + create for a clean slate. Ignored when the DB has open
	// connections, doesn't exist, or in CI where these tools target the wrong host
	// (CI provisions its own empty database).
	try {
		execSync(`dropdb --if-exists ${dbName}`, { stdio: "ignore" });
	} catch {
		/* ignore — falls back to applying migrations onto the existing database */
	}
	try {
		execSync(`createdb ${dbName}`, { stdio: "ignore" });
	} catch {
		/* already exists, or createdb unavailable (CI provisions its own) */
	}

	execSync("npx prisma migrate deploy", {
		env: { ...process.env, DATABASE_URL: url },
		stdio: "inherit",
	});
}
