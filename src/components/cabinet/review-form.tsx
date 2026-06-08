"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

import { submitReview } from "@/lib/actions/testimonials";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  quote: z.string().trim().min(1, "required"),
  authorRole: z.string().trim().min(1, "required"),
});
type FormValues = z.infer<typeof formSchema>;

export function ReviewForm() {
  const t = useTranslations("review");
  const te = useTranslations("admin.errors");
  const locale = useLocale();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  async function onSubmit(values: FormValues) {
    const res = await submitReview(locale, values);
    if (!res.ok) {
      toast.error(te(res.error));
      return;
    }
    reset();
    setDone(true);
    toast.success(t("thanks"));
  }

  const fieldErr = (key: keyof FormValues) =>
    errors[key]?.message ? te(errors[key]!.message as string) : undefined;

  if (done) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <CheckCircle2 className="mx-auto size-10 text-teal" />
        <p className="mt-3 text-muted-foreground">{t("thanks")}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-xl border border-primary/30 bg-primary/5 p-6"
    >
      <h2 className="font-display text-xl font-semibold">{t("title")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("lead")}</p>

      <div className="mt-4 space-y-4">
        <div>
          <Label>{t("quote")}</Label>
          <Textarea {...register("quote")} aria-invalid={!!errors.quote} />
          {fieldErr("quote") && (
            <p className="mt-1 text-sm text-destructive">{fieldErr("quote")}</p>
          )}
        </div>
        <div>
          <Label>{t("role")}</Label>
          <Input
            {...register("authorRole")}
            placeholder={t("rolePlaceholder")}
            aria-invalid={!!errors.authorRole}
          />
          {fieldErr("authorRole") && (
            <p className="mt-1 text-sm text-destructive">{fieldErr("authorRole")}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
