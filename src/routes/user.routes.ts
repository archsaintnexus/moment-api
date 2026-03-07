import { Router } from "express";
import asyncHandler from "express-async-handler";
import { userController } from "@/controllers/user.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, asyncHandler(userController.getMe));
router.patch("/me", authMiddleware, asyncHandler(userController.updateMe));

export default router;
