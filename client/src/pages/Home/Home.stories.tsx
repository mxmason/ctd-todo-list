import preview from "#storybook/preview.tsx";

import { Home } from "./Home.tsx";

const meta = preview.meta({ component: Home, tags: ["ai-generated"] });

export const WithTodos = meta.story({});
export const Empty = meta.story({});
export const LoadError = meta.story({});
