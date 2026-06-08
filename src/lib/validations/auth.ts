import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email({ message: "email_invalid" }),
  password: z.string().min(1, { message: "password_required" }),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(2, { message: "name_min" }).max(100, { message: "name_max" }),
  email: z.string().trim().email({ message: "email_invalid" }),
  password: z
    .string()
    .min(8, { message: "password_min" })
    .refine((value) => new TextEncoder().encode(value).length <= 72, {
      message: "password_max",
    }),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
