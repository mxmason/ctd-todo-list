import type { Result } from "./utils.ts";

export async function unwrap<T>(request: Promise<Result<T>>): Promise<T> {
	const result = await request;
	if (result.error !== null) throw result.error;
	return result.data;
}
