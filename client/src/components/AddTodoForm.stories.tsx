import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import { expect, waitFor } from "storybook/test";

import { AddTodoForm } from "./AddTodoForm.tsx";

const meta = {
	component: AddTodoForm,
	tags: ["ai-generated"],
} satisfies Meta<typeof AddTodoForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SubmitsTitle: Story = {
	play: async ({ canvas, userEvent }) => {
		const input = canvas.getByLabelText(/title/i);
		await userEvent.type(input, "Buy milk");
		await userEvent.click(canvas.getByRole("button", { name: /add/i }));

		// The POST /api/todos handler returns a created todo; on success the
		// component clears the input and shows a confirmation message.
		await waitFor(async () => {
			await expect(canvas.getByText(/todo added!/i)).toBeVisible();
		});
		await expect(input).toHaveValue("");
	},
};

export const ShowsServerError: Story = {
	parameters: {
		msw: {
			handlers: [
				http.post("/api/todos", () =>
					HttpResponse.json({ message: "Title is required" }, { status: 400 }),
				),
			],
		},
	},
	play: async ({ canvas, userEvent }) => {
		await userEvent.type(canvas.getByLabelText(/title/i), "x");
		await userEvent.click(canvas.getByRole("button", { name: /add/i }));

		const alert = await waitFor(() => canvas.getByRole("alert"));
		await expect(alert).toHaveTextContent(/title is required/i);
	},
};
