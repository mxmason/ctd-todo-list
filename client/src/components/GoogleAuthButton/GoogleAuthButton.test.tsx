import { describe, it, expect, render } from "#test";

import { GoogleAuthButton } from "./GoogleAuthButton.tsx";

describe("GoogleAuthButton", () => {
	it("renders the sign-in button", async () => {
		const { getByRole } = await render(<GoogleAuthButton />);
		await expect
			.element(getByRole("button", { name: /sign in with google/i }))
			.toBeVisible();
	});
});
