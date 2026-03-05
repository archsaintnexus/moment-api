import { prisma } from "@/config/prisma";
import bcrypt from "bcrypt";
import resend from "resend";
import { RegisterDTO } from "@/validators/authValidator";
import { ConflictException } from "@/exceptions/app-exceptions";

export class AuthService {
  async register(data: RegisterDTO): Promise<{
    id: string;
    email: string;
    role: string;
    phone: string | null;
  }> {
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
        email: data.email,
        password: hashedPassword,
        role: data.role,
        phone: data.phone ?? null,
      },
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

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };
  }
}
