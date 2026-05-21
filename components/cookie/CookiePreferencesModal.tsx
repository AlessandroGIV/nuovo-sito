"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import Link from "next/link";
import { X, Lock } from "lucide-react";
import { useConsent } from "./ConsentProvider";
import { useLanguage } from "@/contexts/language-context";
import { cookieStrings } from "@/lib/i18n/cookie-strings";
import { DEFAULT_CATEGORIES, type ConsentCategories } from "@/lib/consent/config";
import { readConsent } from "@/lib/consent/cookie";

export function CookiePreferencesModal() {
  const { isPreferencesOpen, closePreferences, acceptAll, rejectAll, savePreferences } =
    useConsent();
  const { language } = useLanguage();
  const s = cookieStrings[language === "en" ? "en" : "it"].modal;

  const [local, setLocal] = useState<ConsentCategories>(DEFAULT_CATEGORIES);

  useEffect(() => {
    if (!isPreferencesOpen) return;
    const record = readConsent();
    setLocal(record?.categories ?? DEFAULT_CATEGORIES);
  }, [isPreferencesOpen]);

  function toggle(key: "analytics" | "marketing") {
    setLocal((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <Dialog.Root
      open={isPreferencesOpen}
      onOpenChange={(open) => !open && closePreferences()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:duration-200 data-[state=open]:duration-300" />

        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-2xl shadow-black/60 ring-1 ring-white/8 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:duration-200 data-[state=open]:duration-300"
          aria-describedby="cookie-modal-desc"
        >
          {/* Gold top accent */}
          <div className="h-[2.5px] bg-gradient-to-r from-[#FF8A00] via-[#FFC300] to-[#FF8A00]" />

          <div className="bg-[#072534]">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-5">
              <div>
                <Dialog.Title className="text-[15px] font-bold tracking-tight text-white">
                  {s.title}
                </Dialog.Title>
                <p
                  id="cookie-modal-desc"
                  className="mt-1 text-[12px] leading-relaxed text-white/50"
                >
                  {s.description}
                </p>
              </div>
              <Dialog.Close asChild>
                <button
                  aria-label="Chiudi"
                  className="mt-0.5 shrink-0 rounded-lg p-1.5 text-white/35 transition-all hover:bg-white/8 hover:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
                >
                  <X className="h-[15px] w-[15px]" />
                </button>
              </Dialog.Close>
            </div>

            {/* Category rows */}
            <div className="mx-6 divide-y divide-white/[0.08] rounded-xl border border-white/[0.08] bg-white/[0.03]">
              <CategoryRow
                name={s.categories.necessary.name}
                description={s.categories.necessary.description}
                enabled={true}
                disabled={true}
                alwaysOnLabel={s.alwaysOn}
                onToggle={() => {}}
              />
              <CategoryRow
                name={s.categories.analytics.name}
                description={s.categories.analytics.description}
                enabled={local.analytics}
                disabled={false}
                onToggle={() => toggle("analytics")}
              />
              <CategoryRow
                name={s.categories.marketing.name}
                description={s.categories.marketing.description}
                enabled={local.marketing}
                disabled={false}
                onToggle={() => toggle("marketing")}
              />
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 pt-4">
              <Link
                href="/cookie"
                onClick={closePreferences}
                className="mb-4 flex items-center gap-1 text-[11.5px] text-white/40 underline underline-offset-2 decoration-white/20 transition-colors hover:text-white/65 hover:decoration-white/40"
              >
                {s.linkPolicy}
              </Link>

              {/*
                Modal footer buttons:
                - "Salva preferenze" is PRIMARY — the user opened this modal to make a custom choice
                - "Rifiuta" and "Accetta" are equal-weight shortcuts
              */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={rejectAll}
                  className="flex-1 rounded-xl border border-white/[0.18] bg-white/[0.05] px-3.5 py-2.5 text-[13px] font-semibold text-white/80 transition-all hover:border-white/28 hover:bg-white/[0.09] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  {s.rejectAll}
                </button>
                <button
                  onClick={() => savePreferences(local)}
                  className="flex-1 rounded-xl border border-[#FFC300]/55 bg-[#FFC300]/[0.1] px-3.5 py-2.5 text-[13px] font-semibold text-[#FFC300] transition-all hover:border-[#FFC300]/80 hover:bg-[#FFC300]/[0.17] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
                >
                  {s.savePreferences}
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 rounded-xl border border-white/[0.18] bg-white/[0.05] px-3.5 py-2.5 text-[13px] font-semibold text-white/80 transition-all hover:border-white/28 hover:bg-white/[0.09] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  {s.acceptAll}
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CategoryRow({
  name,
  description,
  enabled,
  disabled,
  alwaysOnLabel,
  onToggle,
}: {
  name: string;
  description: string;
  enabled: boolean;
  disabled: boolean;
  alwaysOnLabel?: string;
  onToggle: () => void;
}) {
  const switchId = `cookie-toggle-${name.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="flex items-start gap-4 px-4 py-3.5">
      <div className="min-w-0 flex-1">
        <label
          htmlFor={switchId}
          className={`flex items-center gap-2 text-[13px] font-semibold ${
            disabled ? "text-white/35" : "cursor-pointer text-white/90"
          }`}
        >
          {name}
          {disabled && (
            <Lock className="h-3 w-3 text-white/25 shrink-0" aria-hidden="true" />
          )}
        </label>
        <p className="mt-1 text-[11.5px] leading-relaxed text-white/40">{description}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1 pt-0.5">
        {disabled && alwaysOnLabel && (
          <span className="text-[10px] font-medium text-white/30">{alwaysOnLabel}</span>
        )}
        <Switch.Root
          id={switchId}
          checked={enabled}
          disabled={disabled}
          onCheckedChange={onToggle}
          className="relative inline-flex h-[22px] w-[40px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 focus-visible:ring-offset-[#072534] disabled:cursor-not-allowed data-[state=checked]:bg-[#FFC300] data-[state=unchecked]:bg-white/[0.15] disabled:data-[state=checked]:bg-[#FFC300]/40"
        >
          <Switch.Thumb className="pointer-events-none block h-[18px] w-[18px] rounded-full bg-white shadow-md ring-0 transition-transform duration-200 data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-0" />
        </Switch.Root>
      </div>
    </div>
  );
}
