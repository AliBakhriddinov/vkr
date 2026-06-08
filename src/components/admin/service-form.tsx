"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Result = { ok: true } | { ok: false; error: string };
type Action = (values: Record<string, unknown>) => Promise<Result>;

export type ServiceValues = {
  slug: string;
  title: string;
  titleEn: string | null;
  shortDescription: string;
  shortDescriptionEn: string | null;
  fullDescription: string;
  fullDescriptionEn: string | null;
  iconKey: string | null;
  priceFrom: number | null;
  order: number;
  isActive: boolean;
};

const ICON_KEYS = [
  "",
  "code",
  "smartphone",
  "palette",
  "trending-up",
  "megaphone",
  "wrench",
] as const;

const formSchema = z.object({
  slug: z.string().trim().min(1, "required").regex(/^[a-z0-9-]+$/, "slug_format"),
  title: z.string().trim().min(1, "required"),
  titleEn: z.string().optional(),
  shortDescription: z.string().trim().min(1, "required"),
  shortDescriptionEn: z.string().optional(),
  fullDescription: z.string().trim().min(1, "required"),
  fullDescriptionEn: z.string().optional(),
  iconKey: z.string().optional(),
  priceFrom: z.string().optional(),
  order: z.string().optional(),
  isActive: z.boolean().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export function ServiceForm({
  action,
  initial,
  submitLabel,
  pendingLabel,
  listHref,
}: {
  action: Action;
  initial?: ServiceValues;
  submitLabel: string;
  pendingLabel: string;
  listHref: string;
}) {
  const t = useTranslations("admin.services");
  const tf = useTranslations("admin.form");
  const te = useTranslations("admin.errors");
  const ti = useTranslations("admin.icons");
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: initial?.slug ?? "",
      title: initial?.title ?? "",
      titleEn: initial?.titleEn ?? "",
      shortDescription: initial?.shortDescription ?? "",
      shortDescriptionEn: initial?.shortDescriptionEn ?? "",
      fullDescription: initial?.fullDescription ?? "",
      fullDescriptionEn: initial?.fullDescriptionEn ?? "",
      iconKey: initial?.iconKey ?? "",
      priceFrom: initial?.priceFrom != null ? String(initial.priceFrom) : "",
      order: initial?.order != null ? String(initial.order) : "0",
      isActive: initial?.isActive ?? true,
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
        <Label>{t("shortDescription")}</Label>
        <Input
          {...register("shortDescription")}
          aria-invalid={!!errors.shortDescription}
        />
        {fieldErr("shortDescription") && (
          <p className="mt-1 text-sm text-destructive">
            {fieldErr("shortDescription")}
          </p>
        )}
        <Label className="mt-3">
          {t("shortDescription")} · EN · {tf("optional")}
        </Label>
        <Input {...register("shortDescriptionEn")} />
      </div>

      <div>
        <Label>{t("fullDescription")}</Label>
        <Textarea
          {...register("fullDescription")}
          aria-invalid={!!errors.fullDescription}
        />
        {fieldErr("fullDescription") && (
          <p className="mt-1 text-sm text-destructive">
            {fieldErr("fullDescription")}
          </p>
        )}
        <Label className="mt-3">
          {t("fullDescription")} · EN · {tf("optional")}
        </Label>
        <Textarea {...register("fullDescriptionEn")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label>{t("iconKey")}</Label>
          <Controller
            name="iconKey"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "none"}
                onValueChange={(v) => field.onChange(v === "none" ? "" : v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_KEYS.map((k) => (
                    <SelectItem key={k || "none"} value={k || "none"}>
                      {k ? ti(k) : ti("none")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <Label>{t("priceFrom")}</Label>
          <Input type="number" min="0" step="500" {...register("priceFrom")} />
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
          {...register("isActive")}
          className="size-4 rounded border-input"
        />
        {t("isActive")}
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
