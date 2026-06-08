import { z } from "zod";

export const portfolioSchema = z.object({
  slug: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(1).max(160),
  summary: z.string().trim().min(1).max(300),
  description: z.string().trim().min(1),
  clientName: z.string().trim().max(160).optional(),
  projectUrl: z.string().trim().max(300).optional(),
  technologies: z.array(z.string()),
  completedAt: z.date().nullable(),
  order: z.number().int(),
  isPublished: z.boolean(),
});

export type PortfolioInput = z.infer<typeof portfolioSchema>;
