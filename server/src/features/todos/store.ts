import { Prisma, type Todo } from "#generated/prisma/client.ts";
import { prisma } from "#lib/prisma.ts";

/** Promise rejection handler: turn Prisma's "record not found" (P2025) into null. */
const nullIfMissing = (err: unknown): null => {
	if (
		err instanceof Prisma.PrismaClientKnownRequestError &&
		err.code === "P2025"
	) {
		return null;
	}
	throw err;
};

/** Fields a todo's owner is allowed to change. */
export type TodoUpdate = {
	title?: string;
	completed?: boolean;
};

export const listTodos = (userId: string) =>
	prisma.todo.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });

export const createTodo = (userId: string, title: string) =>
	prisma.todo.create({ data: { userId, title } });

/** Apply a partial update to an owned todo; null when no owned row matched. */
export const updateTodo = (
	userId: string,
	id: string,
	data: TodoUpdate,
): Promise<Todo | null> =>
	// userId in the where enforces ownership: another user's row won't match.
	prisma.todo.update({ where: { id, userId }, data }).catch(nullIfMissing);

/** Thin wrapper for the common "toggle completed" case. */
export const setTodoCompleted = (
	userId: string,
	id: string,
	completed: boolean,
) => updateTodo(userId, id, { completed });

/** The deleted todo, or null when no owned row matched. */
export const deleteTodo = (userId: string, id: string): Promise<Todo | null> =>
	prisma.todo.delete({ where: { id, userId } }).catch(nullIfMissing);
