import { describe, it, expect, render } from "#test";

import { Layout } from "./Layout.tsx";

describe("Layout", () => {
	it("renders navigation with authenticated user", async () => {
		const { getByRole } = await render(<Layout />);
		await expect
			.element(getByRole("heading", { name: /todo app/i }))
			.toBeVisible();
		await expect.element(getByRole("link", { name: /home/i })).toBeVisible();
		await expect
			.element(getByRole("button", { name: /log out/i }))
			.toBeVisible();
	});
});
