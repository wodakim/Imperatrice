# Project: L'IMPÉRATRICE - Web App SaaS Migration

## Context
Migration of a functional HTML/JS prototype to a Next.js (React/TypeScript) Web App.
Target: High performance, SEO optimized, Neuro-inclusive design, Supabase Backend.

## Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom themes: Light/Pastel, Dark/Slate)
- **Backend/Auth**: Supabase
- **i18n**: next-intl
- **State Management**: React Context / Hooks / Supabase
- **Deployment**: Vercel (Assumed standard for Next.js)

## Roadmap

### Phase 1: Initialization & Architecture
- [x] **Step 1.1**: Initialize Next.js project with TypeScript, Tailwind, ESLint.
- [x] **Step 1.2**: Configure Tailwind CSS with custom colors/fonts from prototype.
- [x] **Step 1.3**: Setup `next-intl` for i18n (FR, EN, DE, ES, IT, PL).
- [x] **Step 1.4**: Configure Supabase Client & Auth context.
- [x] **Step 1.5**: Project Structure Setup (components, lib, app, public).

### Phase 2: Core Components & Layout
- [x] **Step 2.1**: Implement Root Layout (Metadata, Fonts, ThemeProvider).
- [x] **Step 2.2**: Create Header (Logo, Language Switcher, SOS Button, Theme Toggle).
- [x] **Step 2.3**: Create Navigation Tabs (Responsive).
- [x] **Step 2.4**: Implement Footer & Panic Room Overlay.
- [x] **Step 2.5**: Implement "Spoons" & "Chrono" Widgets (Logic + UI).

### Phase 3: Features Migration
- [x] **Step 3.1**: **Photo Studio**: Implement Client-side Camera Overlay.
- [x] **Step 3.2**: **SEO Generator**: Logic for Title/Description generation + Copy/Paste.
- [x] **Step 3.3**: **Tools**: Profit Calculator, Seasonal Calendar, Packing List.
- [x] **Step 3.4**: **Crush Game**: React implementation of the match-3 game.
- [x] **Step 3.5**: **Trophies**: Database integration for achievements.

### Phase 4: Backend Integration & Data Sync
- [x] **Step 4.1**: Define Database Schema (Users, Spoons, GameScores, Trophies).
- [x] **Step 4.2**: Implement Auth Flows (Login/Signup/Google).
- [x] **Step 4.3**: Sync User Data (Spoons, High Scores) with Supabase.

### Phase 5: SEO & Performance Optimization
- [x] **Step 5.1**: Metadata optimization (Dynamic Titles/Desc).
- [x] **Step 5.2**: JSON-LD Structured Data.
- [x] **Step 5.3**: Sitemap & Robots.txt generation.
- [x] **Step 5.4**: Performance Audit (Lighthouse, Core Web Vitals).

### Phase 6: Compliance & Final Polish
- [x] **Step 6.1**: Legal Pages (Privacy, Terms).
- [x] **Step 6.2**: Cookie Consent banner.
- [x] **Step 6.3**: Security Headers.
- [x] **Step 6.4**: Final A11y Check (Contrast, Aria-labels).

## Current Status
- Project Completed. Ready for review and deployment.
