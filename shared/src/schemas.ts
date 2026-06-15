import { z } from "zod";

export const userSchema = z.object({
	id: z.string(),
	username: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const todoSchema = z.object({
	id: z.string(),
	title: z.string(),
	completed: z.boolean(),
	createdAt: z.string(),
	userId: z.string(),
});
export type Todo = z.infer<typeof todoSchema>;

export const credentialsSchema = z.object({
	// Whitelist safe characters so stored usernames
	// can never carry HTML/JS
	username: z
		.string()
		.min(3)
		.max(32)
		.regex(
			/^[a-zA-Z0-9._-]+$/,
			"username may only contain letters, numbers, and . _ -",
		),
	password: z.string().min(8).max(128),
});
export type Credentials = z.infer<typeof credentialsSchema>;

export const newTodoSchema = z.object({ title: z.string().min(1).max(200) });
export type NewTodo = z.infer<typeof newTodoSchema>;

export const patchTodoSchema = z.object({ completed: z.boolean() });
export type PatchTodo = z.infer<typeof patchTodoSchema>;
