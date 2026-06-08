"use client";

import { type KeyboardEvent, useMemo, useState } from "react";
import PhoneInput from "react-phone-number-input";
import {
  getCountryCallingCode,
  getExampleNumber,
  type CountryCode,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";

import { cn } from "@/lib/utils";

const ABSOLUTE_MAX = 15; // E.164 allows at most 15 digits total

function maxDigitsForCountry(country?: CountryCode): number {
  if (!country) return ABSOLUTE_MAX;
  try {
    const example = getExampleNumber(country, examples);
    if (example) {
      return getCountryCallingCode(country).length + example.nationalNumber.length;
    }
  } catch {
    // fall through to absolute max
  }
  return ABSOLUTE_MAX;
}

export function PhoneField({
  value,
  onChange,
  invalid,
  placeholder,
}: {
  value?: string;
  onChange: (value?: string) => void;
  invalid?: boolean;
  placeholder?: string;
}) {
  const [country, setCountry] = useState<CountryCode | undefined>("RU");
  const maxDigits = useMemo(() => maxDigitsForCountry(country), [country]);

  return (
    <PhoneInput
      international
      defaultCountry="RU"
      value={value}
      onChange={onChange}
      onCountryChange={setCountry}
      placeholder={placeholder}
      numberInputProps={{
        className:
          "h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground",
        onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
          // Блокируем ввод лишних цифр сверх типовой длины номера выбранной страны.
          if (/^[0-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const input = e.currentTarget;
            const hasSelection = input.selectionStart !== input.selectionEnd;
            const digits = (input.value.match(/\d/g) || []).length;
            if (!hasSelection && digits >= maxDigits) e.preventDefault();
          }
        },
      }}
      className={cn(
        "flex h-11 w-full items-center gap-2 rounded-md border border-input bg-background px-3.5 transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40",
        invalid && "border-destructive",
      )}
    />
  );
}
