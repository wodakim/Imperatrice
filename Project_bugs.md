# Project Bugs & Audit

## Reported Issues
1.  **Visual Discrepancy**: The current site does not match the original HTML prototype. (Fonts, Shadows, Layout, Animations).
2.  **Auth Workflow**:
    -   Confirmation emails go to Spam.
    -   Confirmation link redirects to `localhost:3000` instead of production.
3.  **Crush Game**: "Broken" (Likely non-interactive or logic missing).
4.  **Relax Page**: Returns 404.

## Audit: Prototype vs Next.js Implementation

### 1. Visuals (Critical)
-   **Colors**: The HTML defines specific pastel vars (`--bg-color: #FFF0F5`, `--primary-color: #D8BFD8`). Need to verify `globals.css` matches EXACTLY.
-   **Fonts**: Prototype uses `'Segoe UI', Roboto...`. Next.js uses `Inter`. User validated `Inter` but the "vibe" might be lost. Need to ensure `Caveat` is used for "fun" headers as requested in Phase 2.
-   **Shadows**: Prototype uses `--shadow-soft`.
-   **Animations**: The "SlideIn" and "FadeIn" animations from the HTML are likely missing or different in the React components.

### 2. Features
-   **Dashboard**: `DailyTip` is static in React, dynamic in HTML.
-   **Studio**: Native Camera implementation is functional but might lack the "Overlay" styling of the prototype.
-   **SEO**: Logic seems ported but UI needs to match the "Card" style.
-   **Game**: The React implementation is currently a placeholder (Alpha). Needs the swap logic from the prototype.

### 3. Infrastructure
-   **Middleware**: The 404 on `/relax` suggests a routing/middleware issue.
-   **Supabase**: Redirect URL configuration is an environment/dashboard setting, not code, but `NEXT_PUBLIC_SITE_URL` needs to be used.

## Action Plan
1.  **Visual Overhaul**: Copy CSS variables 1:1 from HTML to `globals.css`. Enforce `Caveat` font on headers.
2.  **Fix Game**: Port the JS logic (swap, check matches) to React state.
3.  **Fix Redirect**: Update `utils` or `auth` helper to use `window.location.origin` or env var for redirects.
4.  **Fix 404**: Verify file structure for `/relax`.
