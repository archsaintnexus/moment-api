import { Router } from "express";
import asyncHandler from "express-async-handler";
import { AuthController } from "@/controllers/authController";
import { RegisterSchema } from "@/validators/authValidator";
import { LoginSchema } from "@/validators/authValidator";
import { VerifyOtpSchema } from "@/validators/authValidator";
import { validate } from "@/middlewares/validate.middleware";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  validate(RegisterSchema),
  asyncHandler(authController.register.bind(authController)),
);

router.post(
  "/login",
  validate(LoginSchema),
  asyncHandler(authController.login.bind(authController)),
);

router.post(
  "/verify-otp",
  validate(VerifyOtpSchema),
  asyncHandler(authController.verifyOtp.bind(authController)),
);
export default router;
