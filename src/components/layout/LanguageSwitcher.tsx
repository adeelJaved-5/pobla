"use client";
import { useTransition, useState, useEffect } from "react";

const languageNames: Record<string, string> = {
  ca: "Català",
  en: "English",
  es: "Spanish",
  fr: "French"
};

import { locales } from "@/i18n/config";

export default function LanguageSwitcher() {
  const [_, startTransition] = useTransition();
  const [selectedLocale, setSelectedLocale] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cookieLocale =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("NEXT_LOCALE="))
          ?.split("=")[1] ?? "en";
      setSelectedLocale(cookieLocale);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    setSelectedLocale(newLocale);

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/`;

    startTransition(() => {
      window.location.reload();
    });
  };

  return (
    <select
      value={selectedLocale}
      onChange={handleChange}
      className="border rounded px-2 py-1"
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {languageNames[locale]}
        </option>
      ))}
    </select>
  );
}
