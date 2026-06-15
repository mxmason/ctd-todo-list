import { app } from "#/app.ts";
import { prisma } from "#lib/prisma.ts";

const port = Number(process.env.PORT ?? 3001);
const server = app.listen(port, () => {
	console.log(`server listening on http://localhost:${port}`);
});

// Close the HTTP server and release the DB connection pool on shutdown.
for (const signal of ["SIGINT", "SIGTERM"] as const) {
	process.on(signal, () => {
		server.close(() => {
			void prisma.$disconnect().finally(() => process.exit(0));
		});
	});
}
