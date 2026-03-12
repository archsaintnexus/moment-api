import { Router } from "express";
import asyncHandler from "express-async-handler";
import { validate } from "@/middlewares/validate.middleware";
import { UpdateProfileSchema } from "@/validators/user.validator";
import { userController } from "@/controllers/user.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, asyncHandler(userController.getMe));
router.patch(
  "/me",
  authMiddleware,
  validate(UpdateProfileSchema),
  asyncHandler(userController.updateMe),
);

export default router;
