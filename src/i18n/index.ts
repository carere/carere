// Import all translation files

import enCategory from "./en/category.json";
import enMenu from "./en/menu.json";
import enUi from "./en/ui.json";
import enUses from "./en/uses.json";
import frCategory from "./fr/category.json";
import frMenu from "./fr/menu.json";
import frUi from "./fr/ui.json";
import frUses from "./fr/uses.json";

export const SUPPORTED_LOCALES = ["en", "fr"] as const;
export const DEFAULT_LOCALE = "en" as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const translations = {
  en: {
    ui: enUi,
    menu: enMenu,
    uses: enUses,
    category: enCategory,
  },
  fr: {
    ui: frUi,
    menu: frMenu,
    uses: frUses,
    category: frCategory,
  },
};

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split("/");
  if (SUPPORTED_LOCALES.includes(lang as Locale)) {
    return lang as Locale;
  }
  return DEFAULT_LOCALE;
}

export function useTranslations(lang: Locale) {
  return translations[lang] ?? translations[DEFAULT_LOCALE];
}

export function getLocalePath(path: string, lang: Locale): string {
  if (lang === DEFAULT_LOCALE) return path;
  return `/${lang}${path}`;
}

export function getAlternateLangUrls(currentPath: string): { lang: string; href: string }[] {
  // Strip any existing locale prefix dynamically
  const nonDefaultLocales = SUPPORTED_LOCALES.filter((l) => l !== DEFAULT_LOCALE);
  const localePattern = nonDefaultLocales.join("|");
  const pathWithoutLocale = currentPath
    .replace(new RegExp(`^/(${localePattern})/`), "/")
    .replace(new RegExp(`^/(${localePattern})$`), "/");
  return SUPPORTED_LOCALES.map((locale) => ({
    lang: locale,
    href: getLocalePath(pathWithoutLocale, locale),
  }));
}
