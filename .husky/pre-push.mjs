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
	return out.split("\n").filter(Boolean);
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
const allChanged = new Set(lists.flat());

const serverFiles = [...allChanged].filter(
	(f) => f.startsWith("server/") && f.endsWith(".ts"),
);
const clientFiles = [...allChanged].filter(
	(f) => f.startsWith("client/") && (f.endsWith(".ts") || f.endsWith(".tsx")),
);

if (serverFiles.length === 0 && clientFiles.length === 0) process.exit(0);

const require = createRequire(import.meta.url);

function runRelatedTests(workspace, files) {
	const relFiles = files.map((f) => f.slice(`${workspace}/`.length));
	console.log(`Running related ${workspace} tests for:`);
	for (const f of files) console.log(`  ${f}`);

	const vitestBin = join(
		dirname(require.resolve("vitest/package.json")),
		"vitest.mjs",
	);

	return new Promise((resolve) => {
		const child = spawn(
			process.execPath,
			[vitestBin, "related", "--run", ...relFiles],
			{
				cwd: workspace,
				stdio: "inherit",
			},
		);
		child.on("exit", (code) => resolve(code ?? 1));
	});
}

const jobs = [];
if (serverFiles.length > 0) jobs.push(runRelatedTests("server", serverFiles));
if (clientFiles.length > 0) jobs.push(runRelatedTests("client", clientFiles));

const codes = await Promise.all(jobs);
process.exit(codes.some((c) => c !== 0) ? 1 : 0);
