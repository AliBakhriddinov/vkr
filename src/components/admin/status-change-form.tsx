"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";

import { changeApplicationStatus } from "@/lib/actions/applications";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/admin/submit-button";
import type { ApplicationStatus } from "@/generated/prisma/enums";

const STATUSES: ApplicationStatus[] = ["NEW", "IN_PROGRESS", "DONE", "REJECTED"];

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
  const [status, setStatus] = useState<ApplicationStatus>(currentStatus);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="applicationId" value={applicationId} />
      <input type="hidden" name="toStatus" value={status} />
      <div>
        <Label>{t("newStatus")}</Label>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as ApplicationStatus)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {ts(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>{t("comment")}</Label>
        <Textarea name="comment" placeholder={t("commentPlaceholder")} />
      </div>
      <SubmitButton idle={t("save")} pending={t("saving")} />
    </form>
  );
}
