import { Router } from "express";

import { authRoutes } from "#features/auth/routes.ts";
import { todoRoutes } from "#features/todos/routes.ts";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/todos", todoRoutes);
