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

export type PortfolioValues = {
  slug: string;
  title: string;
  titleEn: string | null;
  summary: string;
  summaryEn: string | null;
  description: string;
  descriptionEn: string | null;
  clientName: string | null;
  clientNameEn: string | null;
  projectUrl: string | null;
  technologies: string[];
  completedAt: Date | null;
  order: number;
  isPublished: boolean;
};

const formSchema = z.object({
  slug: z.string().trim().min(1, "required").regex(/^[a-z0-9-]+$/, "slug_format"),
  title: z.string().trim().min(1, "required"),
  titleEn: z.string().optional(),
  summary: z.string().trim().min(1, "required"),
  summaryEn: z.string().optional(),
  description: z.string().trim().min(1, "required"),
  descriptionEn: z.string().optional(),
  clientName: z.string().optional(),
  clientNameEn: z.string().optional(),
  projectUrl: z.string().optional(),
  technologies: z.string().optional(),
  completedAt: z.string().optional(),
  order: z.string().optional(),
  isPublished: z.boolean().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export function PortfolioForm({
  action,
  initial,
  submitLabel,
  pendingLabel,
  listHref,
}: {
  action: Action;
  initial?: PortfolioValues;
  submitLabel: string;
  pendingLabel: string;
  listHref: string;
}) {
  const t = useTranslations("admin.portfolio");
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
      slug: initial?.slug ?? "",
      title: initial?.title ?? "",
      titleEn: initial?.titleEn ?? "",
      summary: initial?.summary ?? "",
      summaryEn: initial?.summaryEn ?? "",
      description: initial?.description ?? "",
      descriptionEn: initial?.descriptionEn ?? "",
      clientName: initial?.clientName ?? "",
      clientNameEn: initial?.clientNameEn ?? "",
      projectUrl: initial?.projectUrl ?? "",
      technologies: initial?.technologies.join(", ") ?? "",
      completedAt: initial?.completedAt
        ? initial.completedAt.toISOString().slice(0, 10)
        : "",
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>{t("slug")}</Label>
          <Input {...register("slug")} aria-invalid={!!errors.slug} />
          <p className="mt-1 text-xs text-muted-foreground">{tf("slugHint")}</p>
          {fieldErr("slug") && (
            <p className="mt-1 text-sm text-destructive">{fieldErr("slug")}</p>
          )}
        </div>
        <div>
          <Label>{t("name")}</Label>
          <Input {...register("title")} aria-invalid={!!errors.title} />
          {fieldErr("title") && (
            <p className="mt-1 text-sm text-destructive">{fieldErr("title")}</p>
          )}
          <Label className="mt-3">
            {t("name")} · EN · {tf("optional")}
          </Label>
          <Input {...register("titleEn")} />
        </div>
      </div>

      <div>
        <Label>{t("summary")}</Label>
        <Input {...register("summary")} aria-invalid={!!errors.summary} />
        {fieldErr("summary") && (
          <p className="mt-1 text-sm text-destructive">{fieldErr("summary")}</p>
        )}
        <Label className="mt-3">
          {t("summary")} · EN · {tf("optional")}
        </Label>
        <Input {...register("summaryEn")} />
      </div>

      <div>
        <Label>{t("description")}</Label>
        <Textarea {...register("description")} aria-invalid={!!errors.description} />
        {fieldErr("description") && (
          <p className="mt-1 text-sm text-destructive">{fieldErr("description")}</p>
        )}
        <Label className="mt-3">
          {t("description")} · EN · {tf("optional")}
        </Label>
        <Textarea {...register("descriptionEn")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>
            {t("clientName")} · {tf("optional")}
          </Label>
          <Input {...register("clientName")} />
          <Label className="mt-3">
            {t("clientName")} · EN · {tf("optional")}
          </Label>
          <Input {...register("clientNameEn")} />
        </div>
        <div>
          <Label>
            {t("projectUrl")} · {tf("optional")}
          </Label>
          <Input {...register("projectUrl")} />
        </div>
      </div>

      <div>
        <Label>{t("technologies")}</Label>
        <Input {...register("technologies")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>{t("completedAt")}</Label>
          <Input type="date" {...register("completedAt")} />
        </div>
        <div>
          <Label>{t("order")}</Label>
          <Input type="number" {...register("order")} />
          <p className="mt-1 text-xs text-muted-foreground">{tf("orderHint")}</p>
        </div>
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
