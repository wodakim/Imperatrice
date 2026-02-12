# L'IMPÉRATRICE - Architecture Documentation

## 🏗️ High-Level Overview

This project is a **Modern Web Application (SaaS)** designed for Vinted sellers. It leverages **Next.js 14+ (App Router)** for Server-Side Rendering (SSR) and SEO, **Supabase** for Backend-as-a-Service (Auth & DB), and **Tailwind CSS v4** for styling.

### Core Stack
- **Framework**: [Next.js](https://nextjs.org/) (React, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (CSS Variables, `@theme`)
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/) (Middleware-based routing)
- **State Management**: React Hooks + Supabase Realtime (Smart Sync)

---

## 📂 Directory Structure

```
.
|____.env.example
|____.gitignore
|____ARCHITECTURE.md
|____README.md
|____eslint.config.mjs
|____extract_i18n_v2.py
|____messages
| |____de.json
| |____en.json
| |____es.json
| |____fr.json
| |____it.json
| |____pl.json
|____next-env.d.ts
|____next-sitemap.config.js
|____next.config.ts
|____package-lock.json
|____package.json
|____postcss.config.mjs
|____project.md
|____prototype
| |____index.html
|____public
| |____globe.svg
| |____next.svg
| |____robots.txt
| |____sitemap.xml
| |____file.svg
| |____window.svg
| |____vercel.svg
|____src
| |____middleware.ts
| |____lib
| | |____utils.ts
| | |____supabase
| | | |____client.ts
| |____app
| | |____globals.css
| | |____[locale]
| | | |____trophies
| | | | |____page.tsx
| | | |____tools
| | | | |____page.tsx
| | | |____layout.tsx
| | | |____login
| | | | |____page.tsx
| | | |____legal
| | | | |____terms
| | | | | |____page.tsx
| | | | |____privacy
| | | | | |____page.tsx
| | | | |____mentions
| | | | | |____page.tsx
| | | |____studio
| | | | |____page.tsx
| | | |____crush
| | | | |____page.tsx
| | | |____seo
| | | | |____page.tsx
| | | |____dashboard
| | | | |____page.tsx
| | | |____logout
| |____components
| | |____providers.tsx
| | |____layout
| | | |____CookieBanner.tsx
| | | |____Header.tsx
| | | |____PanicRoom.tsx
| | | |____Navigation.tsx
| | |____seo
| | | |____JsonLd.tsx
| | |____auth
| | | |____LoginModal.tsx
| | |____dashboard
| | | |____DailyTip.tsx
| | | |____SpoonsWidget.tsx
| | | |____ChronoWidget.tsx
| |____i18n
| | |____routing.ts
| | |____request.ts
| |____config
| | |____site.ts
| |____hooks
| | |____useAuth.ts
|____supabase_schema.sql
|____tsconfig.json
```

### Key Directories

#### Root
- `next.config.ts`: Configuration for Next.js, including headers (CSP) and i18n plugin.
- `middleware.ts`: The "Traffic Controller". Handles:
    1.  **i18n Routing**: Redirects `/` to `/[locale]` (e.g., `/fr`).
    2.  **Auth Protection**: Checks Supabase session cookies and redirects unauthenticated users away from protected routes (`/dashboard`, etc.).
- `messages/`: JSON translation files (`fr.json`, `en.json`, etc.) namespaced by feature (`Auth`, `Navigation`, `Studio`).

#### `src/app` (App Router)
- `[locale]/`: Dynamic segment acting as the root for all localized pages.
    - `layout.tsx`: **Root Layout**. Wraps the app in:
        - `NextIntlClientProvider`: Context for translations.
        - `ThemeProvider`: Context for Dark/Light mode (`next-themes`).
        - Global Components: `Header`, `Navigation`, `PanicRoom` overlay, `LoginModal`.
    - `page.tsx`: The Landing Page (Public).
    - `dashboard/`: **Protected**. Main user hub with widgets.
    - `studio/`: **Protected**. Camera overlay tool.
    - `seo/`: **Public**. SEO Generator tool.
    - `tools/`: **Public**. Utilities (Calculator, Scripts).
    - `crush/`: **Public**. Gamified experience.
    - `login/`: Authentication page (fallback if modal fails).
    - `legal/`: Static legal pages (Privacy, Terms).

#### `src/components`
- `layout/`: Major UI blocks (`Header`, `Navigation`, `PanicRoom`).
- `auth/`: Authentication UI (`LoginModal` using `@supabase/auth-ui-react`).
- `dashboard/`: Widgets (`SpoonsWidget`, `ChronoWidget`).
- `seo/`: JSON-LD generators for Structured Data.

#### `src/lib` & `src/hooks`
- `lib/supabase/client.ts`: Singleton for the Supabase Browser Client.
- `hooks/useAuth.ts`: Custom hook handling:
    - User session state.
    - **Smart Data Sync**: Logic to merge `localStorage` data (guest progress) into Supabase `profiles` table upon login.

#### `src/i18n`
- `routing.ts`: Configuration for supported locales and pathnames.
- `request.ts`: Server-side logic to load the correct message JSON based on the request locale.

---

## 🔄 Data Flow

1.  **Guest User**:
    -   Interacts with `Tools`, `SEO`, `Crush`.
    -   Data (Score, Spoons) is saved in `localStorage`.
    -   Access to `/dashboard` is blocked by Middleware.

2.  **Authentication**:
    -   User clicks "Connect" -> `LoginModal` opens.
    -   User signs in (Google/Email) via Supabase.
    -   `useAuth` hook detects `SIGNED_IN` event.
    -   **Sync**: Hook reads `localStorage`, calls Supabase `UPSERT` to `profiles` table to save guest progress.

3.  **Authenticated User**:
    -   Middleware allows access to `/dashboard`.
    -   App reads/writes directly to Supabase.

## 🔐 Security
- **RLS (Row Level Security)**: Database policies ensure users can only access their own data.
- **CSP (Content Security Policy)**: Strict headers in `next.config.ts` prevent XSS.
- **Middleware**: Server-side protection for routes.
