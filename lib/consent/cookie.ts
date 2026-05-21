import {
  CONSENT_COOKIE_NAME,
  CONSENT_COOKIE_MAX_AGE,
  POLICY_VERSION,
  type ConsentCategories,
} from "./config";

export type ConsentAction = "accept_all" | "reject_all" | "custom";

export type ConsentRecord = {
  v: number;
  id: string;
  ts: number;
  categories: ConsentCategories;
};

export function readConsent(): ConsentRecord | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE_NAME}=([^;]+)`)
  );
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as ConsentRecord;
  } catch {
    return null;
  }
}

export function writeConsent(categories: ConsentCategories): ConsentRecord {
  const record: ConsentRecord = {
    v: POLICY_VERSION,
    id: crypto.randomUUID(),
    ts: Date.now(),
    categories,
  };
  const encoded = encodeURIComponent(JSON.stringify(record));
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE_NAME}=${encoded}; Max-Age=${CONSENT_COOKIE_MAX_AGE}; SameSite=Lax${secure}; Path=/`;
  return record;
}
