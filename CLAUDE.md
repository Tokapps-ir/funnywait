# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

```
funnywait/                    ← repo root
├── CLAUDE.md
├── landing-dev.sh            ← run both services together
├── landing/                  ← React/Vite frontend (port 3000)
│   ├── src/
│   │   ├── lib/api.ts        ← Strapi fetch + mock fallbacks (locale-aware)
│   │   ├── lib/i18n.ts       ← LanguageContext, translations, useI18n hook
│   │   ├── components/
│   │   │   ├── Hero.tsx      ← Hero section (driven by HeroConfig from Strapi)
│   │   │   └── ...
│   │   └── types.ts          ← Strapi 5 flat types (no attributes wrapper)
│   ├── .env
│   ├── .env.example
│   ├── vite.config.ts
│   └── package.json
└── landing_backend/          ← Strapi 5 backend (port 1337)
    ├── src/
    │   ├── index.ts          ← bootstrap seeder (fa + en for all content types)
    │   └── api/
    │       ├── product/          ← Product collection type (i18n enabled)
    │       ├── calculator-config/ ← CalculatorConfig single type (i18n enabled)
    │       └── hero-config/       ← HeroConfig single type (i18n enabled) ← NEW
    ├── config/
    │   ├── plugins.ts        ← i18n enabled, defaultLocale: 'fa', locales: ['fa','en']
    │   ├── middlewares.ts    ← CORS configured for localhost:3000
    │   └── database.ts       ← SQLite (default)
    └── package.json
```

## Commands

### Run both together (recommended)
```bash
./landing-dev.sh
```

### Frontend only (`landing/`)
```bash
cd landing
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm run lint         # Type-check only (tsc --noEmit, no ESLint configured)
npm run clean        # Remove dist/
```

### Backend only (`landing_backend/`)
```bash
cd landing_backend
npm install          # Install dependencies
npm run develop      # Start Strapi in watch mode at http://localhost:1337
npm run build        # Build admin panel
npm run start        # Start Strapi without watch mode (production)
```

## Environment Setup

In `landing/`, copy `.env.example` to `.env` and set:
- `GEMINI_API_KEY` — Gemini AI key for SmartCalculator's AI features
- `VITE_STRAPI_URL` — Strapi backend URL (defaults to `http://localhost:1337` locally)

The Vite config exposes `GEMINI_API_KEY` via `process.env.GEMINI_API_KEY` (not `import.meta.env`) to the frontend.

## Strapi Admin Setup (first run)

1. Start backend: `cd landing_backend && npm run develop`
   - The bootstrap seeder auto-creates `fa` and `en` locales and seeds all content types
2. Open `http://localhost:1337/admin` and create an admin account
3. **Set Public Permissions** (choose one method):
   - **Option A (Manual):** Go to **Settings → Users & Permissions → Roles → Public** and enable `find` / `findOne` for all content types
   - **Option B (Script - recommended):**
     ```bash
     cd landing_backend
     # Get API token: Settings → API Tokens → Create new (Full access)
     ADMIN_TOKEN=your_token node setup-permissions.js
     ```
4. Content is already seeded — edit via the admin panel if needed

## Architecture

**FunnyWait** is a Persian-first marketing landing page for a waiting-room entertainment SaaS, with English as a second locale. Stack: React 19, TypeScript, Vite, Tailwind CSS v4 (via `@tailwindcss/vite` plugin), Framer Motion, Three.js via `@react-three/fiber`.

### Internationalization

The app supports **Persian (`fa`) and English (`en`)** via two layers:

1. **Strapi i18n** (`@strapi/i18n`, built-in to Strapi 5) — all content types have `pluginOptions.i18n.localized: true` on translatable fields. The frontend passes `?locale=fa` or `?locale=en` to all API calls.

2. **Frontend `LanguageContext`** (`landing/src/lib/i18n.ts`) — wraps the entire app and provides:
   - `locale: 'fa' | 'en'`
   - `setLocale()` — toggled by a button in the nav bar
   - `dir: 'rtl' | 'ltr'` — synced to `document.documentElement` on change
   - `t(key)` — looks up static UI strings (nav labels, loading text, etc.)
   - `translations` — static string dictionary for both locales

When `locale` changes, App.tsx re-fetches all three Strapi endpoints with the new locale.

### Data flow

`landing/src/lib/api.ts` fetches from three Strapi endpoints, each accepting a `locale` param:
- `GET /api/hero-config?locale={locale}`
- `GET /api/products?populate=*&locale={locale}`
- `GET /api/calculator-config?locale={locale}`

All three functions have locale-keyed mock fallbacks — the app works fully offline.

### Strapi content types

| Type | Kind | API endpoint | i18n |
|---|---|---|---|
| `Product` | Collection | `GET /api/products?populate=*&locale={locale}` | ✓ title, description, features, price localized |
| `CalculatorConfig` | Single type | `GET /api/calculator-config?locale={locale}` | ✓ profit messages localized; numeric defaults shared |
| `HeroConfig` | Single type | `GET /api/hero-config?locale={locale}` | ✓ all text fields localized; animation config shared |

### HeroConfig fields

**Localized** (fa/en via Strapi i18n): `badge`, `heading`, `subtitle`, `subtitle_highlight_1`, `subtitle_highlight_2`, `cta_text`, `scroll_hint`

**Shared across locales** (animation / 3D scene): `scroll_fade_start`, `scroll_fade_end`, `scroll_scale_end`, `scroll_y_end`, `morph_1_threshold`, `morph_2_threshold`, `morph_3_threshold`

The morph thresholds control when the `ThreeScene` Rubik's structure transitions between its three states (cube → card fan → tango dancers).

### Seeder

`landing_backend/src/index.ts` bootstrap function:
1. Calls `ensureLocales` → creates `fa` (default) and `en` locales via `strapi.plugin('i18n').service('locales')`
2. Seeds **HeroConfig**, **CalculatorConfig**, **Products** for both locales using `strapi.documents(...).create({ locale: 'fa', data })` + `.update({ documentId, locale: 'en', data })`
3. All seeds are idempotent — they check for existing content before inserting

### Type conventions

All Strapi REST responses are typed as `StrapiResponse<T>` (`{ data: T, meta: any }`).
**Strapi 5 returns flat objects** — no `attributes` wrapper. Types in `types.ts` reflect this directly (e.g., `product.title` not `product.attributes.title`).

### Component layout (App.tsx orchestrates all sections)

| Component | Role |
|---|---|
| `Hero` | Full-screen hero section. Content driven by `HeroConfig` from Strapi. Scroll-fade/scale/y animations use config values. |
| `ThreeScene` | Fixed full-screen WebGL background. A 27-cube Rubik's structure (`MorphingJelly`) morphs through three states (cube → card fan → tango dancers) driven by `scrollYProgress` and `morph_*_threshold` from HeroConfig. |
| `DynamicThreeScene` | Separate Three.js canvas inside SmartCalculator that reacts to the calculator's input state (budget, seats, etc.). |
| `SmoothScroll` | Wraps the app with Lenis for smooth scrolling. |
| `Calculator` | ROI calculator seeded from `CalculatorConfig` fetched from Strapi. Inputs: daily visitors, wait time, participation %, engagement time, attention value, conversion %, profit per sale, subscription cost. Outputs monthly net profit and ROI. |
| `SmartCalculator` | Package recommendation tool. Takes budget, seat count, wait time target, and quality tier; calls `lib/calculatePackage.ts` for purely client-side logic. |
| `ProductCard` | Renders a Strapi `Product` with title, description, features, price, and shop URL. |

### Path alias

`@/` resolves to `landing/` (not `landing/src/`). So `@/src/components/Foo` or `@/src/lib/api` are valid imports within the frontend.

### Styling

Tailwind CSS v4 loaded via the Vite plugin — no `tailwind.config.js` file. Custom CSS classes (`glass-card`, `cinematic-text`) are defined in `landing/src/index.css`.

### Audio

Three `Howl` instances in App.tsx (background music, scroll transition sound, section transition sound) and two in SmartCalculator (click, success). Background music starts muted; the user toggles it via the nav button. Audio files are loaded from external CDN URLs at runtime.

### Persian/RTL

Primary locale is Persian (Farsi, RTL). `toPersianDigits()` and `formatCurrency()` in `landing/src/lib/api.ts` convert Latin numerals to Persian equivalents for display. When locale is `en`, the `dir` attribute on `<html>` is set to `ltr` automatically.
