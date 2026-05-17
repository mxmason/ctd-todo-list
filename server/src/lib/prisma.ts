import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "#generated/prisma/client.ts";

/**
 * Single shared PrismaClient for the process,
 * so the app keeps one connection pool.
 */
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
