import { z } from "zod";

/** Honeypot `company` must stay empty for humans. */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Valid email required"),
  message: z.string().trim().min(10, "Say a bit more (10+ chars)").max(5000),
  company: z.string().max(0),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const chatMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters")
    .max(2000, "Please keep your question under 2000 characters"),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
