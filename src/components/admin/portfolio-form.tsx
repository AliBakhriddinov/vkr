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

export type PortfolioValues = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  clientName: string | null;
  projectUrl: string | null;
  technologies: string[];
  completedAt: Date | null;
  order: number;
  isPublished: boolean;
};

export function PortfolioForm({
  action,
  initial,
  submitLabel,
  pendingLabel,
}: {
  action: Action;
  initial?: PortfolioValues;
  submitLabel: string;
  pendingLabel: string;
}) {
  const t = useTranslations("admin.portfolio");
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
        <Label>{t("summary")}</Label>
        <Input name="summary" defaultValue={initial?.summary} required />
      </div>

      <div>
        <Label>{t("description")}</Label>
        <Textarea
          name="description"
          defaultValue={initial?.description}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>{t("clientName")}</Label>
          <Input name="clientName" defaultValue={initial?.clientName ?? ""} />
        </div>
        <div>
          <Label>{t("projectUrl")}</Label>
          <Input name="projectUrl" defaultValue={initial?.projectUrl ?? ""} />
        </div>
      </div>

      <div>
        <Label>{t("technologies")}</Label>
        <Input
          name="technologies"
          defaultValue={initial?.technologies.join(", ") ?? ""}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>{t("completedAt")}</Label>
          <Input
            name="completedAt"
            type="date"
            defaultValue={
              initial?.completedAt
                ? initial.completedAt.toISOString().slice(0, 10)
                : ""
            }
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
          name="isPublished"
          defaultChecked={initial?.isPublished ?? true}
          className="size-4 rounded border-input"
        />
        {t("isPublished")}
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
          <Link href="/admin/portfolio">{tf("cancel")}</Link>
        </Button>
      </div>
    </form>
  );
}
