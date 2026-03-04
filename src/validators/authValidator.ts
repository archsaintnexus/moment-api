import z from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["CUSTOMER", "CREATIVE"]).default("CUSTOMER"),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;
