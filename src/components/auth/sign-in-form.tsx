"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { AlertCircle } from "lucide-react";

import { signInSchema, type SignInInput } from "@/lib/validations/auth";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm() {
  const t = useTranslations("auth.signIn");
  const te = useTranslations("auth.errors");
  const locale = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) });

  async function onSubmit(values: SignInInput) {
    setFormError(null);
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (res?.error) {
      setFormError("invalid_credentials");
      return;
    }
    const callbackUrl = params.get("callbackUrl");
    const safeCallback =
      callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
        ? callbackUrl
        : `/${locale}/cabinet`;
    router.push(safeCallback);
    router.refresh();
  }

  const fieldError = (key: keyof SignInInput) =>
    errors[key]?.message ? te(errors[key]!.message as string) : undefined;

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        <div>
          <Label>{t("email")}</Label>
          <Input
            type="email"
            autoComplete="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {fieldError("email") && (
            <p className="mt-1.5 text-sm text-destructive">{fieldError("email")}</p>
          )}
        </div>

        <div>
          <Label>{t("password")}</Label>
          <Input
            type="password"
            autoComplete="current-password"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          {fieldError("password") && (
            <p className="mt-1.5 text-sm text-destructive">{fieldError("password")}</p>
          )}
        </div>

        {formError && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <span>{te(formError)}</span>
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/sign-up" className="font-medium text-primary hover:underline">
          {t("signUpLink")}
        </Link>
      </p>
    </div>
  );
}
