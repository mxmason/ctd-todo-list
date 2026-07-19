import { describe, it, expect, render, vi } from "#test";

import { Layout } from "./Layout.tsx";

describe("Layout", () => {
	it("renders navigation with authenticated user", async () => {
		const { getByRole } = await render(<Layout />);
		await expect
			.element(getByRole("heading", { name: /todo app/i }))
			.toBeVisible();
		await expect.element(getByRole("link", { name: /home/i })).toBeVisible();

		const logOutButton = await vi.waitFor(() =>
			getByRole("button", { name: /log out/i }),
		);
		await expect.element(logOutButton).toBeVisible();
	});
});
