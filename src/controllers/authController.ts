import { Request, Response } from "express";
import { AuthService } from "@/services/authServices";
import { LoggerBase } from "@/utils/logger";

export class AuthController extends LoggerBase {
  private authService = new AuthService();

  async register(req: Request, res: Response): Promise<void> {
    const user = await this.authService.register(req.body);
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
    }
  
    async login(req: Request, res: Response): Promise<void> {
        const { token, refreshToken, user } = await this.authService.login(req.body);
        res.status(200).json({
          success: true,
          message: "Login successful",
          data: {
            token,
            refreshToken,
            user,
          },
        });
  }
}
