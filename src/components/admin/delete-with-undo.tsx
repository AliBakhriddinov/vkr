"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteWithUndo({
  action,
  name,
}: {
  action: () => Promise<void>;
  name: string;
}) {
  const t = useTranslations("admin.confirmDelete");
  const router = useRouter();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  function confirmDelete() {
    const row = wrapRef.current?.closest("tr");
    if (row instanceof HTMLElement) row.style.display = "none";

    let undone = false;
    const timer = setTimeout(async () => {
      if (undone) return;
      await action();
      router.refresh();
    }, 3000);

    toast(t("done", { name }), {
      duration: 3000,
      action: {
        label: t("undo"),
        onClick: () => {
          undone = true;
          clearTimeout(timer);
          if (row instanceof HTMLElement) row.style.display = "";
        },
      },
    });
  }

  return (
    <span ref={wrapRef} className="inline-flex">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            aria-label={t("confirm")}
          >
            <Trash2 className="size-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("message", { name })}</AlertDialogDescription>
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialogCancel asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={confirmDelete}>
                {t("confirm")}
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </span>
  );
}
