import {
	describe,
	it,
	expect,
	render,
	worker,
	http,
	HttpResponse,
} from "#test";

import { AddTodoForm } from "./AddTodoForm.tsx";

describe("AddTodoForm", () => {
	it("submits a title and shows success", async () => {
		const { getByLabelText, getByRole, getByText } = await render(
			<AddTodoForm />,
		);
		await getByLabelText(/title/i).fill("Buy milk");
		await getByRole("button", { name: /^add$/i }).click();
		await expect.element(getByText(/todo added!/i)).toBeVisible();
		await expect.element(getByLabelText(/title/i)).toHaveValue("");
	});

	it("shows server error on 400", async () => {
		worker.use(
			http.post("/api/todos", () =>
				HttpResponse.json({ message: "Title is required" }, { status: 400 }),
			),
		);
		const { getByLabelText, getByRole } = await render(<AddTodoForm />);
		await getByLabelText(/title/i).fill("x");
		await getByRole("button", { name: /^add$/i }).click();
		await expect.element(getByRole("alert")).toBeVisible();
	});
});
