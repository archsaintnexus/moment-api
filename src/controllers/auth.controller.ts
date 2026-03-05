import { Request, Response } from "express";
import { authService } from "@/services/auth.service";
import { LoggerBase } from "@/utils/logger";

class AuthController extends LoggerBase {
  register = async (req: Request, res: Response): Promise<void> => {
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
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { token, refreshToken, user } = await authService.login(
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
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    await authService.verifyOtp(req.body);
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const refreshToken = req.body.refreshToken;

    if (!userId || !refreshToken) {
      res.status(400).json({
        success: false,
        message: "User ID and refresh token are required for logout",
      });
      return;
    }

    await authService.logout(userId, refreshToken);
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  };
}

export const authController = new AuthController();
