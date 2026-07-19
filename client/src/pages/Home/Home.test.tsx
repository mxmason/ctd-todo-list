import {
	describe,
	it,
	expect,
	render,
	worker,
	http,
	HttpResponse,
	vi,
} from "#test";

import { Home } from "./Home.tsx";

describe("Home", () => {
	it("shows todos from the API", async () => {
		const { getByText } = await render(<Home />);
		await expect.element(getByText("Buy milk")).toBeVisible();
		await vi.waitFor(() =>
			expect.element(getByText("Walk the dog")).toBeVisible(),
		);
	});

	it("shows empty list when the API returns no todos", async () => {
		worker.use(http.get("/api/todos", () => HttpResponse.json([])));
		const { getByRole, getByText } = await render(<Home />);
		await expect
			.element(getByRole("heading", { name: /my list/i }))
			.toBeVisible();
		await expect.element(getByText(/buy milk/i)).not.toBeInTheDocument();
	});

	it("shows an error when the API fails", async () => {
		worker.use(
			http.get("/api/todos", () =>
				HttpResponse.json({ message: "Server error" }, { status: 500 }),
			),
		);
		const { getByText } = await render(<Home />);
		await expect.element(getByText(/failed to load todos/i)).toBeVisible();
	});
});
