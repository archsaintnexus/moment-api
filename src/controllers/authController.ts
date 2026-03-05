import { Request, Response } from "express";
import { AuthService } from "@/services/authServices";
import { LoggerBase } from "@/utils/logger";

const authService = new AuthService();

export class AuthController extends LoggerBase {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      });
    } catch (err) {
      this.error("Error registering user", { error: err });
      res.status(400).json({
        success: false,
        message: "Error registering user",
      });
    }
  }
}
