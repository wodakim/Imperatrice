# L'IMPÉRATRICE - Migration Project Plan

## Goal
Transform the HTML/JS prototype into a production-ready Next.js SaaS application with Supabase backend, keeping strict visual fidelity and enhancing features (SEO, Camera, Auth).

## Current Status
**Phase:** 6 - Final Polish & Handover
**Progress:** 100%

## Roadmap

### Phase 1: Initialization & Architecture (✅ Done)
- [x] Initialize Next.js 14+ project with TypeScript.
- [x] Configure Tailwind CSS v4 with custom variables (Light/Dark themes).
- [x] Set up `next-intl` for i18n (FR, EN, DE, ES, IT, PL).
- [x] Extract translations from `index.html`.
- [x] Configure Supabase client.

### Phase 2: Core Components & Layout (✅ Done)
- [x] Implement Layout (Header, Navigation, Panic Room, Footer).
- [x] Implement Dashboard Widgets (Spoons, Chrono).
- [x] Ensure responsive design (Mobile First).

### Phase 3: Features Migration (✅ Done)
- [x] **Studio:** `StudioPage` with native Camera API and "Wizard Card" UI.
- [x] **SEO:** `SeoPage` with title scoring, description generator, and trend packs.
- [x] **Tools:** `ToolsPage` with Calculator, Scripts, Packing List, Seasonal Widget.
- [x] **Crush:** `CrushPage` match-3 game logic and UI.
- [x] **Trophies:** `TrophiesPage` with achievement system.
- [x] **Relax:** `RelaxPage` with breathing exercise and jokes.

### Phase 4: Backend Integration (✅ Done)
- [x] Supabase Auth (Email/Password, Google).
- [x] Database Schema (Profiles, Spoons, Trophies).
- [x] Smart Data Sync (Merge Guest Data).
- [x] RLS Policies.

### Phase 5: SEO & Performance (✅ Done)
- [x] Metadata & Open Graph.
- [x] JSON-LD Structured Data.
- [x] Sitemap & Robots.txt.
- [x] Canonical URLs.

### Phase 6: Compliance & Security (✅ Done)
- [x] Legal Pages (Mentions, Privacy, Terms).
- [x] Cookie Consent Banner.
- [x] Security Headers.

### Phase 7: Deep Visual Audit (✅ Done)
- [x] **Header:** Rounded corners, Language Select style, Animations.
- [x] **Navigation:** Horizontal scroll layout, Pill style.
- [x] **Dashboard:** Custom Icons, Seasonal Tip, Dynamic Tips.
- [x] **Studio:** Immersive "Wizard Card" UI.
- [x] **Tools:** Vertical layouts, Missing widgets.
- [x] **Relax:** Card wrapper.
- [x] **Panic Room:** Fix event listeners.

## Next Steps
- [ ] Deploy to Vercel.
- [ ] Configure Supabase Environment Variables in Production.
