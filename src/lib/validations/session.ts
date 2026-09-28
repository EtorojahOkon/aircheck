import { z } from "zod";

export const sessionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Session name is required")
    .min(3, "Session name must be at least 3 characters")
    .max(80, "Session name must be under 80 characters"),
});

export type SessionFormData = z.infer<typeof sessionSchema>;
