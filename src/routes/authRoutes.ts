import { Router } from "express";
import { AuthController } from "@/controllers/authController";
import { RegisterSchema } from "@/validators/authValidator";
import { validate } from "@/middlewares/validate.middleware";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  validate(RegisterSchema),
  authController.register.bind(authController),
);

export default router;
