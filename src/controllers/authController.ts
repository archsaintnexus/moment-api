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
    const { token, refreshToken, user } = await this.authService.login(
      req.body,
    );
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

  async verifyOtp(req: Request, res: Response): Promise<void> {
    await this.authService.verifyOtp(req.body);
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  }

  async logout(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;
    const refreshToken = req.body.refreshToken;

    if (!userId || !refreshToken) {
      res.status(400).json({
        success: false,
        message: "User ID and refresh token are required for logout",
      });
      return;
    }

    await this.authService.logout(userId, refreshToken);
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  }
}
