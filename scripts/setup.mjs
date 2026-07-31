#!/usr/bin/env node

/**
 * One-shot dev environment setup:
 * - env file
 * - Postgres role + databases
 * - migrations.
 */

import { execSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const envExample = path.join(root, "server/.env.example");
const envFile = path.join(root, "server/.env");

const DB_USER = "postgres";
const DB_PASSWORD = "postgres";
const DATABASES = ["ctd_todo_list", "ctd_todo_list_test"];

function run(cmd, options = {}) {
	console.log(`$ ${cmd}`);
	return execSync(cmd, { stdio: "inherit", ...options });
}

function runQuiet(cmd) {
	try {
		execSync(cmd, { stdio: "ignore" });
		return true;
	} catch {
		return false;
	}
}

function step(label) {
	console.log(`\n▶ ${label}`);
}

step("Environment file");
if (existsSync(envFile)) {
	console.log("server/.env already exists — leaving it untouched.");
} else if (existsSync(envExample)) {
	copyFileSync(envExample, envFile);
	console.log("Created server/.env from server/.env.example.");
} else {
	console.warn("server/.env.example not found — skipping.");
}

step("Postgres role");
const roleExists = runQuiet(
	`psql postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1`,
);
if (roleExists) {
	console.log(`Role "${DB_USER}" already exists.`);
} else if (
	runQuiet(
		`psql postgres -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}' CREATEDB"`,
	)
) {
	console.log(`Created role "${DB_USER}".`);
} else {
	console.warn(
		`Could not create role "${DB_USER}" — is Postgres running? Create it manually and re-run.`,
	);
}

step("Databases");
for (const db of DATABASES) {
	if (runQuiet(`createdb -U ${DB_USER} ${db}`)) {
		console.log(`Created database "${db}".`);
	} else {
		console.log(
			`Database "${db}" already exists (or createdb failed) — skipping.`,
		);
	}
}

step("Migrations");
run("npm run db:migrate --workspace=server");

console.log("\nSetup complete. Run `npm run dev` to start the API and client.");
