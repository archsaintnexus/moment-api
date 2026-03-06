import { Role } from "@/generated/prisma/enums";
import z from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(Role).default(Role.CUSTOMER),
  phone: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const VerifyOtpSchema = z.object({
  email: z.email("Invalid email address"),
  otp: z.string().min(6, "OTP must be at least 6 characters long"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  phone: z.string().optional(),
});

export type VerifyOtpDTO = z.infer<typeof VerifyOtpSchema>;

export type LoginDTO = z.infer<typeof LoginSchema>;

export type RegisterDTO = z.infer<typeof RegisterSchema>;

export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
