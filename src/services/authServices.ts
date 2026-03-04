import Prisma from "@prisma/client";
import { prisma } from "@/config/prisma";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import resend from "resend";
import { RegisterDTO } from "@/validators/authValidator";
import { ConflictException } from "@/exceptions/app-exceptions";

export class AuthService {
  async register(data: RegisterDTO): Promise<void> {
    // Check if user with the same email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException("Email is already registered");
    }
  }
}
