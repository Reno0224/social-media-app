import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .pipe(z.email("Invalid email address")),
  password: z.string().min(1, "Password wajib di isi"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    username: z
      .string()
      .min(3, "Username minimal 3 karakter")
      .max(30, "Maksimal 30 karakter")
      .regex(/^[A-Za-z0-9_]+$/, "Hanya huruf, angka, titik, dan underscrore"),

    email: z.email("Email tidak valid"),
    phone: z.string().min(8, "Nomor telepon tidak valid"),
    password: z.string().min(8, "Minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
