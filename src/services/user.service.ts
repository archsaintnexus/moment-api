import { prisma } from "@/config/prisma";
import { NotFoundException } from "@/exceptions/app-exceptions";
import { LoggerBase } from "@/utils/logger";
import { UpdateProfileDTO } from "@/validators/user.validator";

export class UserService extends LoggerBase {
  getMe = async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      this.warn(`User with ID ${userId} not found`);
      throw new NotFoundException("User not found");
    }
    return user;
  };

  updateMe = async (userId: string, data: UpdateProfileDTO) => {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!existingUser) {
      this.warn(`User with ID ${userId} not found`);
      throw new NotFoundException("User not found");
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });
    this.log("User profile updated successfully");
    return user;
  };
}
