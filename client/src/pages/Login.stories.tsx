import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Login } from "./Login.tsx";

const meta = {
	component: Login,
	tags: ["ai-generated"],
} satisfies Meta<typeof Login>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvas }) => {
		await expect(canvas.getByLabelText(/username/i)).toBeVisible();
		await expect(canvas.getByLabelText(/password/i)).toBeVisible();
		await expect(
			canvas.getByRole("button", { name: /^log in$/i }),
		).toBeVisible();
		await expect(
			canvas.getByRole("button", { name: /sign in with google/i }),
		).toBeVisible();
	},
};

export const FillsCredentials: Story = {
	play: async ({ canvas, userEvent }) => {
		const username = canvas.getByLabelText(/username/i);
		const password = canvas.getByLabelText(/password/i);
		await userEvent.type(username, "ada");
		await userEvent.type(password, "lovelace1");
		await expect(username).toHaveValue("ada");
		await expect(password).toHaveValue("lovelace1");
	},
};
