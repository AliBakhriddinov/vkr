"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/admin/submit-button";

type State = { error?: string };
type Action = (prevState: State, formData: FormData) => Promise<State>;

export type ServiceValues = {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconKey: string | null;
  priceFrom: number | null;
  order: number;
  isActive: boolean;
};

export function ServiceForm({
  action,
  initial,
  submitLabel,
  pendingLabel,
}: {
  action: Action;
  initial?: ServiceValues;
  submitLabel: string;
  pendingLabel: string;
}) {
  const t = useTranslations("admin.services");
  const tf = useTranslations("admin.form");
  const te = useTranslations("admin.errors");
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="mt-6 max-w-2xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>{t("slug")}</Label>
          <Input name="slug" defaultValue={initial?.slug} required />
        </div>
        <div>
          <Label>{t("name")}</Label>
          <Input name="title" defaultValue={initial?.title} required />
        </div>
      </div>

      <div>
        <Label>{t("shortDescription")}</Label>
        <Input
          name="shortDescription"
          defaultValue={initial?.shortDescription}
          required
        />
      </div>

      <div>
        <Label>{t("fullDescription")}</Label>
        <Textarea
          name="fullDescription"
          defaultValue={initial?.fullDescription}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label>{t("iconKey")}</Label>
          <Input name="iconKey" defaultValue={initial?.iconKey ?? ""} />
        </div>
        <div>
          <Label>{t("priceFrom")}</Label>
          <Input
            name="priceFrom"
            type="number"
            min="0"
            defaultValue={initial?.priceFrom ?? ""}
          />
        </div>
        <div>
          <Label>{t("order")}</Label>
          <Input name="order" type="number" defaultValue={initial?.order ?? 0} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={initial?.isActive ?? true}
          className="size-4 rounded border-input"
        />
        {t("isActive")}
      </label>

      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <span>{te(state.error)}</span>
        </div>
      )}

      <div className="flex gap-3">
        <SubmitButton idle={submitLabel} pending={pendingLabel} />
        <Button asChild variant="ghost">
          <Link href="/admin/services">{tf("cancel")}</Link>
        </Button>
      </div>
    </form>
  );
}
