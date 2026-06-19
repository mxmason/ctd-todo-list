import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Button } from "./Button.tsx";

const meta = {
	component: Button,
	tags: ["ai-generated"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: { primary: true, label: "Order now" },
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole("button", { name: /order now/i }),
		).toBeVisible();
	},
};

// Verifies the imported button.css is actually applied: the primary
// variant sets background-color #555ab9 -> rgb(85, 90, 185).
export const CssCheck: Story = {
	args: { primary: true, label: "Submit" },
	play: async ({ canvas }) => {
		const button = canvas.getByRole("button", { name: /submit/i });
		await expect(getComputedStyle(button).backgroundColor).toBe(
			"rgb(85, 90, 185)",
		);
	},
};
