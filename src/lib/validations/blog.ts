import { z } from "zod";

export const blogSchema = z.object({
  slug: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(1).max(200),
  excerpt: z.string().trim().min(1).max(400),
  content: z.string().trim().min(1),
  titleEn: z.string().trim().max(200).nullable(),
  excerptEn: z.string().trim().max(400).nullable(),
  contentEn: z.string().trim().nullable(),
  tags: z.array(z.string()),
  publishedAt: z.date().nullable(),
});

export type BlogInput = z.infer<typeof blogSchema>;
