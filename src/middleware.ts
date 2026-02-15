import createMiddleware from 'next-intl/middleware';
import {defineRouting} from 'next-intl/routing';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export const routing = defineRouting({
  locales: ['fr', 'en', 'de', 'es', 'it', 'pl'],
  defaultLocale: 'fr',
  localeDetection: true
});

const handleI18n = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const res = handleI18n(req);

  // Initialize Supabase client for auth checks
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    }
  );

  // Protected routes logic
  const path = req.nextUrl.pathname;
  const protectedRoutes = ['/admin', '/profile'];
  // Add other protected routes if needed, e.g. /dashboard might be protected or not depending on specs
  // For now, restoring original logic for /admin and /profile
  const isProtected = protectedRoutes.some(route => path.includes(route));

  if (isProtected) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      const localeSegment = path.split('/')[1];
      const validLocale = routing.locales.includes(localeSegment as any) ? localeSegment : routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${validLocale}/login`, req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/', '/(fr|en|de|es|it|pl)/:path*']
};
