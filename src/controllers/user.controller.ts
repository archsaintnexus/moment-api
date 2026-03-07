import { Request, Response } from "express";
import { UserService } from "@/services/user.service";
import { LoggerBase } from "@/utils/logger";

class UserController extends LoggerBase {
  private userService = new UserService();

  getMe = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const user = await this.userService.getMe(userId);
    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: user,
    });
  };

  updateMe = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const updatedUser = await this.userService.updateMe(userId, req.body);
    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: updatedUser,
    });
  };
}

export const userController = new UserController();
export default userController;
