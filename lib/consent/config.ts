export const CONSENT_COOKIE_NAME = "giv_consent";
export const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

// Increment this whenever the cookie policy changes substantially.
// Users who consented under a previous version will see the banner again.
export const POLICY_VERSION = 1;

export type ConsentCategories = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export const DEFAULT_CATEGORIES: ConsentCategories = {
  necessary: true,
  analytics: false,
  marketing: false,
};
