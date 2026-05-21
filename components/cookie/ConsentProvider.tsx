"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { readConsent, writeConsent, type ConsentRecord } from "@/lib/consent/cookie";
import { updateConsent } from "@/lib/consent/gtag";
import {
  POLICY_VERSION,
  DEFAULT_CATEGORIES,
  type ConsentCategories,
} from "@/lib/consent/config";

type ConsentAction = "accept_all" | "reject_all" | "custom";

interface ConsentContextType {
  consent: ConsentCategories;
  isBannerVisible: boolean;
  isPreferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (categories: ConsentCategories) => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

function logConsent(record: ConsentRecord, action: ConsentAction, locale: string) {
  fetch("/api/consent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      consent_id: record.id,
      policy_version: record.v,
      action,
      categories: record.categories,
      locale,
    }),
  }).catch(() => {
    // fire-and-forget: the user's choice is already applied via cookie + gtag
  });
}

export function ConsentProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  const [consent, setConsent] = useState<ConsentCategories>(DEFAULT_CATEGORIES);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  useEffect(() => {
    const record = readConsent();
    if (!record || record.v < POLICY_VERSION) {
      setIsBannerVisible(true);
    } else {
      setConsent(record.categories);
    }
  }, []);

  const applyChoice = useCallback(
    (categories: ConsentCategories, action: ConsentAction) => {
      const record = writeConsent(categories);
      updateConsent(categories);
      setConsent(categories);
      setIsBannerVisible(false);
      setIsPreferencesOpen(false);
      logConsent(record, action, locale);
    },
    [locale]
  );

  const acceptAll = useCallback(() => {
    applyChoice({ necessary: true, analytics: true, marketing: true }, "accept_all");
  }, [applyChoice]);

  const rejectAll = useCallback(() => {
    applyChoice(
      { necessary: true, analytics: false, marketing: false },
      "reject_all"
    );
  }, [applyChoice]);

  const savePreferences = useCallback(
    (categories: ConsentCategories) => {
      const all = categories.analytics && categories.marketing;
      const none = !categories.analytics && !categories.marketing;
      const action: ConsentAction = all ? "accept_all" : none ? "reject_all" : "custom";
      applyChoice(categories, action);
    },
    [applyChoice]
  );

  const openPreferences = useCallback(() => setIsPreferencesOpen(true), []);
  const closePreferences = useCallback(() => setIsPreferencesOpen(false), []);

  return (
    <ConsentContext.Provider
      value={{
        consent,
        isBannerVisible,
        isPreferencesOpen,
        openPreferences,
        closePreferences,
        acceptAll,
        rejectAll,
        savePreferences,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider");
  return ctx;
}
