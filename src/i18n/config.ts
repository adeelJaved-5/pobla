// export type Locale = (typeof locales)[number];

// export const locales = ["en", "es", "ca" ] as const;
// export const defaultLocale: Locale = "en";

// i18n/config.ts

export const locales = ["en", "es", "ca" , "fr"] as const;
export const defaultLocale = "ca";
export type Locale = typeof locales[number];

// ✅ Disable routing by not using locale-prefixed routes
export const localeRouting = false;
