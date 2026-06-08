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

export type BlogValues = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  publishedAt: Date | null;
};

export function BlogForm({
  action,
  initial,
  submitLabel,
  pendingLabel,
}: {
  action: Action;
  initial?: BlogValues;
  submitLabel: string;
  pendingLabel: string;
}) {
  const t = useTranslations("admin.blog");
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
        <Label>{t("excerpt")}</Label>
        <Input name="excerpt" defaultValue={initial?.excerpt} required />
      </div>

      <div>
        <Label>{t("content")}</Label>
        <Textarea name="content" defaultValue={initial?.content} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>{t("tags")}</Label>
          <Input name="tags" defaultValue={initial?.tags.join(", ") ?? ""} />
        </div>
        <div>
          <Label>{t("publishedAt")}</Label>
          <Input
            name="publishedAt"
            type="date"
            defaultValue={
              initial?.publishedAt
                ? initial.publishedAt.toISOString().slice(0, 10)
                : ""
            }
          />
        </div>
      </div>

      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <span>{te(state.error)}</span>
        </div>
      )}

      <div className="flex gap-3">
        <SubmitButton idle={submitLabel} pending={pendingLabel} />
        <Button asChild variant="ghost">
          <Link href="/admin/blog">{tf("cancel")}</Link>
        </Button>
      </div>
    </form>
  );
}
