import * as React from "react";

import type { ApiError, Result } from "#api/utils.ts";

export const useApiRequest = <T>(initialLoading = false) => {
	const [data, setData] = React.useState<T | null>(null);
	const [error, setError] = React.useState<ApiError | null>(null);
	const [loading, setLoading] = React.useState(initialLoading);

	const run = async (request: Promise<Result<T>>): Promise<boolean> => {
		setLoading(true);
		setData(null);
		setError(null);

		const result = await request;
		if (result.error === null) {
			setData(result.data);
		} else {
			setError(result.error);
		}
		setLoading(false);
		return result.error === null;
	};

	return { data, error, loading, run };
};
