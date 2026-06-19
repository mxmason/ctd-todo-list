import preview from "#storybook/preview.tsx";

import { AddTodoForm } from "./AddTodoForm.tsx";

const meta = preview.meta({ component: AddTodoForm, tags: ["ai-generated"] });

export const Default = meta.story({});
export const SubmitsTitle = meta.story({});
export const ShowsServerError = meta.story({});
