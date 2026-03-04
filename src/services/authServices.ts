import Prisma from "@prisma/client";
import { prisma } from "@/config/prisma";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import resend from "resend";
import { RegisterDTO } from "@/validators/authValidator";
import { ConflictException } from "@/exceptions/app-exceptions";

export class AuthService {
  async register(
    data: RegisterDTO,
  ): Promise<{ id: string; email: string; role: string }> {
    // Check if user with the same email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException("Email is already registered");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });

    const OTP = Math.floor(Math.random() * 1000000);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
