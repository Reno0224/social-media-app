import { z } from "zod";

export const commentSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, " Comment cannnot be empty")
    .max(500, "Comment must be at most 500 characters"),
});

export type CommentInput = z.infer<typeof commentSchema>;
