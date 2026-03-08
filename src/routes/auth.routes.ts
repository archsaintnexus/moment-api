import { Router } from "express";
import asyncHandler from "express-async-handler";
import { authController } from "@/controllers/auth.controller";
import { RegisterSchema } from "@/validators/auth.validator";
import { LoginSchema } from "@/validators/auth.validator";
import { VerifyOtpSchema } from "@/validators/auth.validator";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               phone:
 *                 type: string
 *                 example: "08012345678"
 *               role:
 *                 type: string
 *                 enum: [CUSTOMER, CREATIVE]
 *                 example: CUSTOMER
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already in use
 *       422:
 *         description: Validation error
 */

router.post(
  "/register",
  validate(RegisterSchema),
  asyncHandler(authController.register),
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       422:
 *         description: Validation error
 */
router.post(
  "/login",
  validate(LoginSchema),
  asyncHandler(authController.login),
);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify email with OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       401:
 *         description: Invalid or expired OTP
 *       422:
 *         description: Validation error
 */
router.post(
  "/verify-otp",
  validate(VerifyOtpSchema),
  asyncHandler(authController.verifyOtp),
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout and invalidate refresh token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", authMiddleware, asyncHandler(authController.logout));
export default router;
