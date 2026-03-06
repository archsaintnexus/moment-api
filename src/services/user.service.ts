import { prisma } from "@/config/prisma";
import { NotFoundException } from "@/exceptions/app-exceptions";
import { LoggerBase } from "@/utils/logger";

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
}
