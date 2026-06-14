"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import type { ApplicationStatus } from "@/generated/prisma/enums";
import { decideStatusChange, isApplicationStatus } from "@/lib/applications/status";

type State = { error?: string };

export async function changeApplicationStatus(
  locale: string,
  _prev: State,
  formData: FormData,
): Promise<State> {
  const user = await requireRole(locale, ["ADMIN"]);

  const applicationId = String(formData.get("applicationId") ?? "");
  const toStatus = String(formData.get("toStatus") ?? "");
  const comment = String(formData.get("comment") ?? "").trim();

  if (!applicationId || !isApplicationStatus(toStatus)) {
    return { error: "invalid" };
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { status: true },
  });

  const decision = decideStatusChange(application?.status ?? null, toStatus, comment);

  if (decision.kind === "invalid_status" || decision.kind === "not_found") {
    return { error: "invalid" };
  }

  if (decision.kind === "transition") {
    const next = decision.to as ApplicationStatus;
    // Читаем статус внутри транзакции, чтобы fromStatus в истории отражал
    // реальное значение на момент записи (защита от гонки двух менеджеров).
    await prisma.$transaction(async (tx) => {
      const current = await tx.application.findUnique({
        where: { id: applicationId },
        select: { status: true },
      });
      if (!current || current.status === next) return;
      await tx.application.update({
        where: { id: applicationId },
        data: {
          status: next,
          assignedManagerId: user.id,
          managerComment: comment || undefined,
        },
      });
      await tx.applicationStatusChange.create({
        data: {
          applicationId,
          fromStatus: current.status,
          toStatus: next,
          changedById: user.id,
          comment: comment || null,
        },
      });
    });
  } else if (decision.kind === "comment_only") {
    // Комментарий без смены статуса тоже попадает в историю обращения:
    // запись фиксирует текущий статус как исходный и новый.
    await prisma.$transaction(async (tx) => {
      const current = await tx.application.findUnique({
        where: { id: applicationId },
        select: { status: true },
      });
      if (!current) return;
      await tx.application.update({
        where: { id: applicationId },
        data: { managerComment: comment },
      });
      await tx.applicationStatusChange.create({
        data: {
          applicationId,
          fromStatus: current.status,
          toStatus: current.status,
          changedById: user.id,
          comment,
        },
      });
    });
  }

  revalidatePath(`/${locale}/admin/applications/${applicationId}`);
  revalidatePath(`/${locale}/admin/applications`);
  revalidatePath(`/${locale}/cabinet`);
  return {};
}
