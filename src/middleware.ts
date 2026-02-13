import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from './navigation';

export default async function middleware(req: NextRequest) {
  // 1. Initialiser le middleware i18n
  const handleI18n = createMiddleware(routing);
  const res = handleI18n(req);

  // 2. Initialiser Supabase (pour rafraîchir la session si nécessaire)
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

  const path = req.nextUrl.pathname;
  const protectedRoutes = ['/admin', '/profile'];
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
  // Matcher standard pour next-intl + exclusion auth
  matcher: ['/((?!api|_next|_vercel|.*\\..*|auth).*)']
};