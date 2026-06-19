import { describe, it, expect, render } from "#test";

import { Login } from "./Login.tsx";

describe("Login", () => {
	it("renders form fields and buttons", async () => {
		const { getByLabelText, getByRole } = await render(<Login />);
		await expect.element(getByLabelText(/username/i)).toBeVisible();
		await expect.element(getByLabelText(/password/i)).toBeVisible();
		await expect
			.element(getByRole("button", { name: /^log in$/i }))
			.toBeVisible();
		await expect
			.element(getByRole("button", { name: /sign in with google/i }))
			.toBeVisible();
	});

	it("fills credentials", async () => {
		const { getByLabelText } = await render(<Login />);
		await getByLabelText(/username/i).fill("ada");
		await getByLabelText(/password/i).fill("lovelace1");
		await expect.element(getByLabelText(/username/i)).toHaveValue("ada");
		await expect.element(getByLabelText(/password/i)).toHaveValue("lovelace1");
	});
});
