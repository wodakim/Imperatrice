import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export default async function middleware(req: NextRequest) {
  const intlResponse = createMiddleware(routing)(req);

  // Clone request to read cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) => intlResponse.cookies.set(name, value, options))
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;
  const protectedRoutes = ['/dashboard', '/studio', '/trophies'];
  const isProtected = protectedRoutes.some(route => path.includes(route));

  if (isProtected && !user) {
    const locale = path.split('/')[1] || 'fr';
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  return intlResponse;
}

export const config = {
  matcher: ['/', '/(fr|en|de|es|it|pl)/:path*']
};
