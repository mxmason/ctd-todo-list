import { http, HttpResponse } from "msw";
import { userEvent, within } from "storybook/test";

import preview from "#storybook/preview.tsx";

import { AddTodoForm } from "./AddTodoForm.tsx";

const meta = preview.meta({ component: AddTodoForm, tags: ["ai-generated"] });

export const Default = meta.story({});

export const SubmitsTitle = meta.story({
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.type(canvas.getByLabelText(/title/i), "Buy milk");
		await userEvent.click(canvas.getByRole("button", { name: /^add$/i }));
	},
});

export const ShowsServerError = meta.story({
	parameters: {
		msw: {
			handlers: [
				http.post("/api/todos", () =>
					HttpResponse.json({ message: "Title is required" }, { status: 400 }),
				),
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.type(canvas.getByLabelText(/title/i), "x");
		await userEvent.click(canvas.getByRole("button", { name: /^add$/i }));
	},
});
