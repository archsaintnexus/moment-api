import z from "zod";

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 characters long")
    .optional(),
});

export type UpdateProfileDTO = z.infer<typeof UpdateProfileSchema>;
