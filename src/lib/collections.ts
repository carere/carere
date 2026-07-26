import type { Locale } from "@/i18n/index";
import type { CategoryData } from "@/types/index.d.ts";

/**
 * Filters a collection of entries by their language prefix.
 *
 * Content collection entries in this project use IDs prefixed with a locale
 * (e.g. "en/my-article", "fr/my-article"). This helper filters a collection
 * to only include entries matching the given locale.
 *
 * @param items - Array of collection entries whose `id` is locale-prefixed.
 * @param lang  - The locale to filter by ("en" or "fr").
 * @returns Only the entries whose `id` starts with `<lang>/`.
 */
export function filterByLang<T extends { id: string }>(items: T[], lang: Locale): T[] {
  return items.filter((item) => item.id.startsWith(`${lang}/`));
}

/**
 * Resolves a category ID to its translated display title.
 *
 * Looks up the given `categoryId` inside the category list that corresponds to
 * the specified content `type` (work). If no matching
 * category is found, the raw `categoryId` string is returned as a fallback.
 *
 * @param categoryData - The full translated category data object.
 * @param type         - The content type whose category list should be searched.
 * @param categoryId   - The machine-readable category identifier to resolve.
 * @returns The human-readable category title, or `categoryId` when unresolved.
 */
export function resolveCategoryTitle(
  categoryData: CategoryData,
  type: "work",
  categoryId: string,
): string {
  const categoryInfo = categoryData[type].find((cat) => cat.id === categoryId);
  return categoryInfo?.title || categoryId;
}

/**
 * Filters out draft articles from a collection.
 *
 * In development mode (`import.meta.env.DEV`), all articles including drafts
 * are returned so they can be previewed locally. In production builds, articles
 * with `draft: true` are excluded from all public-facing queries.
 *
 * @param items - Array of collection entries with a `draft` optional boolean field.
 * @returns All entries in dev mode; only non-draft entries in production.
 */
export function filterLiveArticles<T extends { data: { draft?: boolean } }>(items: T[]): T[] {
  if (import.meta.env.DEV) return items;
  return items.filter((item) => !item.data.draft);
}

/**
 * Strips the locale prefix from a content collection entry ID.
 *
 * Collection entry IDs follow the pattern `<locale>/<slug>` (e.g.
 * "en/my-article"). This helper removes the leading `en/` or `fr/` so the
 * slug can be used in URL paths and other locale-independent contexts.
 *
 * @param id - A locale-prefixed content entry ID.
 * @returns The ID without its locale prefix.
 */
export function stripLangPrefix(id: string): string {
  return id.replace(/^(en|fr)\//, "");
}
