import preview from "#storybook/preview.tsx";

import { Login } from "./Login.tsx";

const meta = preview.meta({ component: Login, tags: ["ai-generated"] });

export const Default = meta.story({});
export const FillsCredentials = meta.story({});
