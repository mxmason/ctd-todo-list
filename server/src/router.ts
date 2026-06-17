import { Router } from "express";

import { todoRoutes } from "#features/todos/routes.ts";
import { authRoutes } from "#features/users/auth-routes.ts";
import { userRoutes } from "#features/users/routes.ts";

export const router = Router();

router.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

router.use("/users", userRoutes);
router.use("/todos", todoRoutes);
router.use("/auth", authRoutes);
