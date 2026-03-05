import { Router } from "express";
import asyncHandler from "express-async-handler";
import { authController } from "@/controllers/auth.controller";
import { RegisterSchema } from "@/validators/authValidator";
import { LoginSchema } from "@/validators/authValidator";
import { VerifyOtpSchema } from "@/validators/authValidator";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";

const router = Router();

router.post(
  "/register",
  validate(RegisterSchema),
  asyncHandler(authController.register),
);

router.post(
  "/login",
  validate(LoginSchema),
  asyncHandler(authController.login),
);

router.post(
  "/verify-otp",
  validate(VerifyOtpSchema),
  asyncHandler(authController.verifyOtp),
);

router.post("/logout", authMiddleware, asyncHandler(authController.logout));
export default router;
