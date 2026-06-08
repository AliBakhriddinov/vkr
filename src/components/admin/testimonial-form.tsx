"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Link, useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Result = { ok: true } | { ok: false; error: string };
type Action = (values: Record<string, unknown>) => Promise<Result>;

export type TestimonialValues = {
  quote: string;
  authorName: string;
  authorRole: string;
  order: number;
  isPublished: boolean;
};

const formSchema = z.object({
  quote: z.string().trim().min(1, "required"),
  authorName: z.string().trim().min(1, "required"),
  authorRole: z.string().trim().min(1, "required"),
  order: z.string().optional(),
  isPublished: z.boolean().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export function TestimonialForm({
  action,
  initial,
  submitLabel,
  pendingLabel,
  listHref,
}: {
  action: Action;
  initial?: TestimonialValues;
  submitLabel: string;
  pendingLabel: string;
  listHref: string;
}) {
  const t = useTranslations("admin.testimonials");
  const tf = useTranslations("admin.form");
  const te = useTranslations("admin.errors");
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quote: initial?.quote ?? "",
      authorName: initial?.authorName ?? "",
      authorRole: initial?.authorRole ?? "",
      order: initial?.order != null ? String(initial.order) : "0",
      isPublished: initial?.isPublished ?? true,
    },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const res = await action(values);
    if (!res.ok) {
      setServerError(res.error);
      return;
    }
    toast.success(tf("saved"));
    router.push(listHref);
    router.refresh();
  }

  const fieldErr = (key: keyof FormValues) =>
    errors[key]?.message ? te(errors[key]!.message as string) : undefined;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-6 max-w-2xl space-y-4"
    >
      <div>
        <Label>{t("quote")}</Label>
        <Textarea {...register("quote")} aria-invalid={!!errors.quote} />
        {fieldErr("quote") && (
          <p className="mt-1 text-sm text-destructive">{fieldErr("quote")}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>{t("authorName")}</Label>
          <Input {...register("authorName")} aria-invalid={!!errors.authorName} />
          {fieldErr("authorName") && (
            <p className="mt-1 text-sm text-destructive">{fieldErr("authorName")}</p>
          )}
        </div>
        <div>
          <Label>{t("authorRole")}</Label>
          <Input {...register("authorRole")} aria-invalid={!!errors.authorRole} />
          {fieldErr("authorRole") && (
            <p className="mt-1 text-sm text-destructive">{fieldErr("authorRole")}</p>
          )}
        </div>
      </div>

      <div className="max-w-[12rem]">
        <Label>{t("order")}</Label>
        <Input type="number" {...register("order")} />
        <p className="mt-1 text-xs text-muted-foreground">{tf("orderHint")}</p>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          {...register("isPublished")}
          className="size-4 rounded border-input"
        />
        {t("isPublished")}
        <span className="text-muted-foreground">· {tf("activeHint")}</span>
      </label>

      {serverError && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <span>{te(serverError)}</span>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? pendingLabel : submitLabel}
        </Button>
        <Button asChild variant="ghost">
          <Link href={listHref}>{tf("cancel")}</Link>
        </Button>
      </div>
    </form>
  );
}
