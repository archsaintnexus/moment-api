import { Router } from "express";
import asyncHandler from "express-async-handler";
import { userController } from "@/controllers/user.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/me", authMiddleware, asyncHandler(userController.getMe));

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe Updated
 *               phone:
 *                 type: string
 *                 example: "08012345678"
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       422:
 *         description: Validation error
 */
router.patch("/me", authMiddleware, asyncHandler(userController.updateMe));

export default router;
