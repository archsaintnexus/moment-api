import { token } from "morgan";
import z from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["CUSTOMER", "CREATIVE"]).default("CUSTOMER"),
  otp: z.string().optional(),
  phone: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  token: z.string().optional(),
  refreshTokens: z.string().optional(),
});

export const VerifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "OTP must be at least 6 characters long"),
});

export type VerifyOtpDTO = z.infer<typeof VerifyOtpSchema>;

export type LoginDTO = z.infer<typeof LoginSchema>;

export type RegisterDTO = z.infer<typeof RegisterSchema>;
