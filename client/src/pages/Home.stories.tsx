import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import { expect, waitFor } from "storybook/test";

import { Home } from "./Home.tsx";

const meta = {
	component: Home,
	tags: ["ai-generated"],
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTodos: Story = {
	play: async ({ canvas }) => {
		// Data arrives from the default GET /api/todos MSW handler.
		await waitFor(async () => {
			await expect(canvas.getByText("Buy milk")).toBeVisible();
		});
		await expect(canvas.getByText(/walk the dog/i)).toBeVisible();
	},
};

export const Empty: Story = {
	parameters: {
		msw: {
			handlers: [http.get("/api/todos", () => HttpResponse.json([]))],
		},
	},
	play: async ({ canvas }) => {
		await expect(
			await canvas.findByRole("heading", { name: /my list/i }),
		).toBeVisible();
		await expect(canvas.queryByText("Buy milk")).not.toBeInTheDocument();
	},
};

export const LoadError: Story = {
	parameters: {
		msw: {
			handlers: [
				http.get("/api/todos", () =>
					HttpResponse.json({ message: "Server error" }, { status: 500 }),
				),
			],
		},
	},
	play: async ({ canvas }) => {
		await waitFor(async () => {
			await expect(canvas.getByText(/failed to load todos/i)).toBeVisible();
		});
	},
};
