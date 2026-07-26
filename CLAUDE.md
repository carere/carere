# CLAUDE.md

## Project Overview

This is Carere's personal/portfolio website built with [Astro](https://astro.build/). It is deployed to **Cloudflare Workers**.

## Runtime & Package Manager

This project uses **Bun** (v1.2.2+), NOT Node.js or npm.

- Always use `bun` for all commands: `bun install`, `bun run dev`, `bun add <package>`, etc.
- **NEVER** use `npm`, `yarn`, `pnpm`, or `npx`.
- The lockfile is `bun.lock` (not `package-lock.json`).

## Key Commands

```sh
bun install          # Install dependencies
bun run dev          # Start dev server at localhost:4321
bun run build        # Build for production (outputs to ./dist/)
bun run preview      # Preview production build locally
bun run lint         # Lint with Biome (auto-fix)
bun run format       # Format with Biome (auto-fix)
bun run check        # Biome lint + format check (no auto-fix)
```

## Shell Commands & Hooks

- When using `rm` to delete files and a hook prevents the operation, use the `trash` command instead.
- `trash` moves files to the macOS Trash instead of permanent deletion.
- Usage: `trash <file-or-directory> [file2 ...]`
- Example: `trash src/components/sections/OldSection.astro`

## Tech Stack

- **Astro 5.17+** — static site generator
- **Tailwind CSS v4** — via `@tailwindcss/vite` plugin, using the new `@theme` directive
- **Biome** — linting + formatting (NO Prettier, NO ESLint)
- **TypeScript** — strict mode, `@/*` alias maps to `src/*`
- **Lenis** — smooth scrolling on homepage
- **@astrojs/sitemap** — auto-generated sitemap

## Code Style & Formatting (Biome)

- **Formatter**: 2-space indent, double quotes, line width 100
- **Linter**: recommended rules + `useSortedClasses` for Tailwind class ordering
- **Imports**: auto-organized by Biome
- **CSS**: Tailwind directives support enabled
- **HTML**: experimental full support enabled
- Run `bun run check` before committing to validate.

## Project Structure

```
src/
├── assets/              # Images (hero, team, works, services, icons, reviews, companies)
├── components/
│   ├── layout/          # Header, Footer, Container, Section
│   ├── sections/        # Page sections (Hero, About, CTA, Reviews, etc.)
│   ├── ui/              # Reusable UI (Badge, LinkButton, Pagination, etc.)
│   └── util/            # Utility components (DynamicImage, GoogleAnalytics)
├── config/              # JSON config (social.json, work.json)
├── data/                # Content collections
│   ├── articles/{en,fr}/*.md
│   ├── reviews/{en,fr}/*.md
│   └── works/{en,fr}/*.json
├── i18n/                # Internationalization
│   ├── index.ts         # i18n helpers (getLangFromUrl, useTranslations, etc.)
│   ├── en/*.json        # English translations (site, menu, ui, faq, service, etc.)
│   └── fr/*.json        # French translations
├── layouts/
│   └── Layout.astro     # Main layout (SEO, OGP, schema.org, View Transitions)
├── lib/
│   └── collections.ts   # Collection helpers (filterByLang, stripLangPrefix, etc.)
├── middleware.ts         # Astro middleware (currently passthrough)
├── pages/
│   ├── 404.astro
│   └── [...lang]/       # i18n dynamic routes (en = default, fr = prefixed)
│       ├── index.astro
│       ├── about.astro
│       ├── uses.astro
│       ├── privacy.astro
│       ├── contact/
│       ├── articles/
│       └── works/
├── styles/
│   ├── global.css       # Design tokens (@theme), CSS reset, component styles
│   └── fonts.css        # @font-face declarations
├── content.config.ts    # Content collection schemas (works, articles)
└── types/
    └── index.d.ts       # Shared TypeScript interfaces
```

## i18n System

- **Supported locales**: English (`en` — default) and French (`fr`).
- **Routing**: manual — English has no prefix (`/about/`), French is prefixed (`/fr/about/`).
- Pages use `[...lang]` catch-all param: `{ params: { lang: undefined } }` for en, `{ params: { lang: "fr" } }` for fr.
- Translations are in `src/i18n/{en,fr}/*.json` — import via `useTranslations(lang)`.
- Content collections are locale-prefixed: `src/data/articles/en/slug.json`, `src/data/articles/fr/slug.json`.
- Use `filterByLang()` from `src/lib/collections.ts` to filter collections by locale.
- Use `stripLangPrefix()` to get a clean slug from collection entry IDs.

## Content Collections

- Defined in `src/content.config.ts` using Astro's `defineCollection` + Zod schemas.
- Four collections: `works`, `articles`, `pages`, and `reviews`.
- Data stored as JSON in `src/data/{works,articles}/{en,fr}/*.json`.
- Image references in collection data use relative paths from `src/assets/`.

## Styling Conventions

- Tailwind CSS v4 with `@theme` directive in `global.css` for design tokens.
- Custom CSS properties for non-Tailwind values (line-height, z-index, transitions, easing).
- Component-specific CSS (animations, pseudo-elements) in `global.css` under comments.
- Use existing design tokens (colors, spacing, font sizes, radii, shadows) — don't invent new ones.
- **Breakpoints**: sm=600px, md=900px, lg=1200px, xl=1280px, 2xl=1536px.

## Component Patterns

- **Sections** go in `src/components/sections/` — each is a self-contained page section.
- **UI components** go in `src/components/ui/` — reusable, composable pieces.
- **Layout components** go in `src/components/layout/` — structural wrappers.
- All components accept a `lang` prop (type `Locale`) for i18n.
- Pages compose sections: `<Hero lang={lang} /> <About lang={lang} /> <CTA lang={lang} />`.

## Adding New Content

- **Articles**: create JSON file in `src/data/articles/{en,fr}/slug.json` following the article schema in `content.config.ts`.
- **Works**: create JSON file in `src/data/works/{en,fr}/slug.json` following the work schema in `content.config.ts`.
- **Reviews**: create markdown file in `src/data/reviews/{en,fr}/slug.md` with `author`, `role`, `avatar` in frontmatter and the quote text as the markdown body.
- **Translations**: add keys to the relevant JSON files in `src/i18n/{en,fr}/`.
- **New sections**: create `.astro` file in `src/components/sections/`, accept `lang` prop, import into page.

## Important Notes

- This is a **static site** — no server-side rendering, no API routes.
- **View Transitions** (ClientRouter) are enabled for smooth page navigation.
- The homepage uses **Lenis** for smooth scrolling and `IntersectionObserver` for scroll-triggered animations.
- Path alias: `@/` resolves to `src/` (configured in `tsconfig.json`).
