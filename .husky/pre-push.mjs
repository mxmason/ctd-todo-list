import { execFile, spawn } from "node:child_process";
import console from "node:console";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import process from "node:process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const ZERO = "0".repeat(40);

async function git(args) {
	try {
		const { stdout } = await execFileAsync("git", args);
		return stdout.trim();
	} catch {
		return null;
	}
}

async function changedFiles(base, head) {
	const out = base
		? await git(["diff", "--name-only", `${base}..${head}`])
		: await git(["ls-tree", "-r", "--name-only", head]);
	if (!out) return [];
	return out
		.split("\n")
		.filter((f) => f.startsWith("server/") && f.endsWith(".ts"));
}

async function filesForRef({ localSha, remoteSha }) {
	if (!localSha || localSha === ZERO) return [];
	const base =
		remoteSha === ZERO
			? await git(["merge-base", localSha, "origin/HEAD"])
			: remoteSha;
	return changedFiles(base, localSha);
}

const refs = readFileSync(0, "utf8")
	.split("\n")
	.filter(Boolean)
	.map((line) => {
		const [localRef, localSha, remoteRef, remoteSha] = line.split(" ");
		return { localRef, localSha, remoteRef, remoteSha };
	});

const lists = await Promise.all(refs.map(filesForRef));
const changed = new Set(lists.flat());

if (changed.size === 0) process.exit(0);

const relFiles = [...changed].map((f) => f.slice("server/".length));
console.log("Running related tests for:");
for (const f of changed) console.log(`  ${f}`);

const require = createRequire(import.meta.url);
const vitestBin = join(
	dirname(require.resolve("vitest/package.json")),
	"vitest.mjs",
);

const child = spawn(
	process.execPath,
	[vitestBin, "related", "--run", ...relFiles],
	{ cwd: "server", stdio: "inherit" },
);
child.on("exit", (code) => process.exit(code ?? 1));
