import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { GoogleAuthButton } from "./GoogleAuthButton.tsx";

const meta = {
	component: GoogleAuthButton,
	tags: ["ai-generated"],
} satisfies Meta<typeof GoogleAuthButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole("button", { name: /sign in with google/i }),
		).toBeVisible();
	},
};
