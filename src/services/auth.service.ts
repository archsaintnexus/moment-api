import { prisma } from "@/config/prisma";
import bcrypt from "bcrypt";
import resend from "resend";
import {
  LoginDTO,
  RegisterDTO,
  VerifyOtpDTO,
} from "@/validators/auth.validator";
import {
  ConflictException,
  UnauthorizedException,
} from "@/exceptions/app-exceptions";
import { generateRefreshToken, generateToken } from "@/utils/token";
import { User } from "@/generated/prisma/client";

class AuthService {
  async register(data: RegisterDTO): Promise<Omit<User, "password" | "otp" | "otpExpiration" | "token">> {
    // Check if user with the same email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException("Email is already registered");
    }

    //  check if phone number is already registered
    if (data.phone) {
      const existingPhoneUser = await prisma.user.findUnique({
        where: { phone: data.phone },
      });

      if (existingPhoneUser) {
        throw new ConflictException("Phone number is already registered");
      }
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        phone: data.phone ?? null,
      },
      omit: {
        password: true,
        otp: true,
        otpExpiration: true,
        token: true
      }
    });

    const OTP = Math.floor(100000 + Math.random() * 900000);
    const OTP_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes
    const hashedOTP = await bcrypt.hash(OTP.toString(), 12);

    // Save the hashed OTP and its expiration time in the database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: hashedOTP,
        otpExpiration: new Date(Date.now() + OTP_EXPIRATION_TIME),
      },
    });

    // send OTP
    const resendClient = new resend.Resend(process.env.MAIL_API_KEY!);
    await resendClient.emails.send({
      from: "software@archsaintnexus.com",
      to: data.email,
      subject: "Verify your email",
      html: `<p>Your OTP for email verification is: <strong>${OTP}</strong></p>`,
    });

    return user;
  }

  async login(data: LoginDTO): Promise<{
    token: string;
    refreshToken: string;
    user: Pick<User, "id" | "name" | "email" | "role" | "phone" | "isVerified">;
  }> {
    // check if user with the email exists
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (!user.isVerified) {
      throw new UnauthorizedException("Email is not verified");
    }

    // check if password is correct
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    // generate tokens
    const token = generateToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isVerified: user.isVerified,
      }
    };
  }

  async verifyOtp(data: VerifyOtpDTO): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or OTP");
    }

    if (!user.otp || !user.otpExpiration) {
      throw new UnauthorizedException(
        "OTP not found. Please request a new one.",
      );
    }

    if (new Date() > user.otpExpiration) {
      throw new UnauthorizedException(
        "OTP has expired. Please request a new one.",
      );
    }

    const isOtpValid = await bcrypt.compare(data.otp, user.otp);
    if (!isOtpValid) {
      throw new UnauthorizedException("Invalid email or OTP");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otp: null,
        otpExpiration: null,
      },
    });
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        userId,
        token: refreshToken,
      },
    });
  }
}

export const authService = new AuthService();
