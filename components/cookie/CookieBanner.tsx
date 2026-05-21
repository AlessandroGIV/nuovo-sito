"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useConsent } from "./ConsentProvider";
import { useLanguage } from "@/contexts/language-context";
import { cookieStrings } from "@/lib/i18n/cookie-strings";

export function CookieBanner() {
  const { isBannerVisible, acceptAll, rejectAll, openPreferences } = useConsent();
  const { language } = useLanguage();
  const s = cookieStrings[language === "en" ? "en" : "it"].banner;

  if (!isBannerVisible) return null;

  return (
    <div
      role="region"
      aria-label={s.title}
      className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-300 ease-out"
    >
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/8">
        {/* Gold accent bar — brand identity, not a dark pattern */}
        <div className="h-[2.5px] bg-gradient-to-r from-[#FF8A00] via-[#FFC300] to-[#FF8A00]" />

        <div className="relative bg-[#072534] px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
          {/* X = reject all, per Garante guidelines */}
          <button
            onClick={rejectAll}
            aria-label={s.close}
            className="absolute right-3 top-3 rounded-lg p-1.5 text-white/35 transition-all hover:bg-white/8 hover:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
          >
            <X className="h-[15px] w-[15px]" />
          </button>

          {/* Title */}
          <p className="pr-8 text-[13.5px] font-semibold tracking-tight text-white sm:text-sm">
            {s.title}
          </p>

          {/* Description */}
          <p className="mt-1.5 pr-6 text-[12px] leading-relaxed text-white/55 sm:text-[12.5px]">
            {s.description}{" "}
            <Link
              href="/cookie"
              className="text-white/75 underline underline-offset-2 decoration-white/25 transition-colors hover:text-white hover:decoration-white/60"
            >
              {s.linkPolicy}
            </Link>
            {" · "}
            <Link
              href="/privacy"
              className="text-white/75 underline underline-offset-2 decoration-white/25 transition-colors hover:text-white hover:decoration-white/60"
            >
              {s.linkPrivacy}
            </Link>
          </p>

          {/*
            Three buttons — EQUAL visual weight per Garante Linee guida giugno 2021.
            Identical style: same border, background, text color, padding.
            No filled primary, no muted secondary. The label is the only distinction.
          */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            {[
              { label: s.rejectAll, action: rejectAll },
              { label: s.acceptAll, action: acceptAll },
              { label: s.customize, action: openPreferences },
            ].map(({ label, action }) => (
              <button
                key={label}
                onClick={action}
                className="flex-1 rounded-xl border border-white/[0.18] bg-white/[0.06] px-4 py-2.5 text-[13px] font-semibold text-white/90 transition-all hover:border-white/30 hover:bg-white/[0.11] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-1 focus-visible:ring-offset-[#072534]"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
