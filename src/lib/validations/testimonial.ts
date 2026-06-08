import { z } from "zod";

export const testimonialSchema = z.object({
  quote: z.string().trim().min(1).max(600),
  authorName: z.string().trim().min(1).max(120),
  authorRole: z.string().trim().min(1).max(160),
  order: z.number().int(),
  isPublished: z.boolean(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
