"use client";

import { useConsent } from "./ConsentProvider";
import { useLanguage } from "@/contexts/language-context";
import { cookieStrings } from "@/lib/i18n/cookie-strings";

export function ManageCookiesButton() {
  const { openPreferences } = useConsent();
  const { language } = useLanguage();
  const label = cookieStrings[language === "en" ? "en" : "it"].footer.manage;

  return (
    <button
      onClick={openPreferences}
      className="underline underline-offset-2 transition-colors hover:text-white"
    >
      {label}
    </button>
  );
}
