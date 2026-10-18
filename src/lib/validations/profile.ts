import z from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[A-Za-z0-9._]+$/, "Only letters, numbers, dots, and underscores"),
  phone: z.string().min(8, "Invalid Phone Number"),
  bio: z.string().max(160, "Bio must be at most 160 characters"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
