export type ApiError = { status: number; message: string };
export type Result<T> =
	| { data: T; error: null }
	| { data: null; error: ApiError };

// Distinguishes an HTTP-level failure (returned by apiFetch below)
// from a raw network exception (e.g. a fetch aborted by the page
// unloading) — the two need different handling: only the former reflects
// something the server has told us about the request.
export function isApiError(error: unknown): error is ApiError {
	return (
		typeof error === "object" &&
		error !== null &&
		"status" in error &&
		"message" in error
	);
}

export async function apiFetch<T>(
	path: string,
	options?: RequestInit,
): Promise<Result<T>> {
	const res = await fetch(`/api${path}`, {
		...options,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...options?.headers,
		},
	});

	if (!res.ok) {
		let message = res.statusText;
		try {
			message = (await res.json()).message ?? message;
		} catch (_) {
			/* use statusText if body parse fails */
		}
		return { data: null, error: { status: res.status, message } };
	}

	if (res.status === 204) return { data: undefined as T, error: null };

	return { data: (await res.json()) as T, error: null };
}
