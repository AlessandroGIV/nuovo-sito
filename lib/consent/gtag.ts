declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function updateConsent(c: { analytics: boolean; marketing: boolean }) {
  window.gtag?.("consent", "update", {
    analytics_storage: c.analytics ? "granted" : "denied",
    ad_storage: c.marketing ? "granted" : "denied",
    ad_user_data: c.marketing ? "granted" : "denied",
    ad_personalization: c.marketing ? "granted" : "denied",
  });
}
