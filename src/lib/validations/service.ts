import { z } from "zod";

export const serviceSchema = z.object({
  slug: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(1).max(120),
  shortDescription: z.string().trim().min(1).max(300),
  fullDescription: z.string().trim().min(1),
  titleEn: z.string().trim().max(120).nullable(),
  shortDescriptionEn: z.string().trim().max(300).nullable(),
  fullDescriptionEn: z.string().trim().nullable(),
  iconKey: z.string().trim().max(40).optional(),
  priceFrom: z.number().int().nonnegative().nullable(),
  order: z.number().int(),
  isActive: z.boolean(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
