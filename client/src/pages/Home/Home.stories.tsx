import { http, HttpResponse } from "msw";

import preview from "#storybook/preview.tsx";

import { Home } from "./Home.tsx";

const meta = preview.meta({ component: Home, tags: ["ai-generated"] });

export const WithTodos = meta.story({});

export const Empty = meta.story({
	beforeEach({ msw }) {
		msw.use(http.get("/api/todos", () => HttpResponse.json([])));
	},
});

export const LoadError = meta.story({
	beforeEach({ msw }) {
		msw.use(
			http.get("/api/todos", () =>
				HttpResponse.json({ message: "Server error" }, { status: 500 }),
			),
		);
	},
});
