import { Prisma, type Todo } from "#generated/prisma/client.ts";
import { prisma } from "#lib/prisma.ts";

const nullIfMissing = (err: unknown): null => {
	if (
		err instanceof Prisma.PrismaClientKnownRequestError &&
		err.code === "P2025"
	) {
		return null;
	}
	throw err;
};

export type TodoUpdate = {
	title?: string;
	completed?: boolean;
};

export const listTodos = (userId: string) =>
	prisma.todo.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });

export const createTodo = (userId: string, title: string) =>
	prisma.todo.create({ data: { userId, title } });

export const createManyTodos = (userId: string, titles: string[]) =>
	prisma.todo.createMany({
		data: titles.map((title) => ({ userId, title })),
	});

export const updateTodo = (
	userId: string,
	id: string,
	data: TodoUpdate,
): Promise<Todo | null> =>
	// userId in the where enforces ownership: another user's row won't match.
	prisma.todo.update({ where: { id, userId }, data }).catch(nullIfMissing);

export const setTodoCompleted = (
	userId: string,
	id: string,
	completed: boolean,
) => updateTodo(userId, id, { completed });

export const deleteTodo = (userId: string, id: string): Promise<Todo | null> =>
	prisma.todo.delete({ where: { id, userId } }).catch(nullIfMissing);
