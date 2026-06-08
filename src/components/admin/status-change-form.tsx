"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { changeApplicationStatus } from "@/lib/actions/applications";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/admin/submit-button";
import type { ApplicationStatus } from "@/generated/prisma/enums";

const STATUSES: ApplicationStatus[] = ["NEW", "IN_PROGRESS", "DONE", "REJECTED"];

const selectClass =
  "h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40";

export function StatusChangeForm({
  locale,
  applicationId,
  currentStatus,
}: {
  locale: string;
  applicationId: string;
  currentStatus: ApplicationStatus;
}) {
  const t = useTranslations("admin.applications");
  const ts = useTranslations("status");
  const action = changeApplicationStatus.bind(null, locale);
  const [, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="applicationId" value={applicationId} />
      <div>
        <Label>{t("newStatus")}</Label>
        <select name="toStatus" defaultValue={currentStatus} className={selectClass}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {ts(s)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>{t("comment")}</Label>
        <Textarea name="comment" placeholder={t("commentPlaceholder")} />
      </div>
      <SubmitButton idle={t("save")} pending={t("saving")} />
    </form>
  );
}
