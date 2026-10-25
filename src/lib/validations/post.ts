import { z } from "zod";

export const MAX_IMAGE_SIZE = 25 * 1024 * 1024; // 5 MB (tebakan, sesuaikan dengan Swagger)

export const createPostSchema = z.object({
  caption: z
    .string()
    .trim()
    .max(2200, "Caption must be at most 2200 characters"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Please choose an image file";
  if (file.size > MAX_IMAGE_SIZE) return "Image must be 5 MB or smaller";
  return null;
}

