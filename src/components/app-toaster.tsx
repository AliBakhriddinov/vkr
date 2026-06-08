"use client";

import type { CSSProperties } from "react";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export function AppToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="bottom-right"
      theme={resolvedTheme === "light" ? "light" : "dark"}
      closeButton
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "rounded-xl border shadow-lg shadow-primary/5",
          title: "font-medium",
          description: "text-muted-foreground",
          actionButton:
            "rounded-md bg-primary px-3 font-medium text-primary-foreground hover:bg-primary/90",
          closeButton:
            "border-border bg-popover text-muted-foreground hover:text-foreground",
        },
      }}
    />
  );
}
