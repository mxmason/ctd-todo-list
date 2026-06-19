import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Layout } from "./Layout.tsx";

const meta = {
	component: Layout,
	tags: ["ai-generated"],
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole("heading", { name: /todo app/i }),
		).toBeVisible();
		await expect(canvas.getByRole("link", { name: /home/i })).toBeVisible();
		// The default /users/me handler resolves a user, so the authenticated
		// "Log out" control eventually appears in the header.
		await expect(
			await canvas.findByRole("button", { name: /log out/i }),
		).toBeVisible();
	},
};
