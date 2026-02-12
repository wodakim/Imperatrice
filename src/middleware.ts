import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Define routing explicitly here to avoid import issues in Edge Runtime
const routing = {
  locales: ['fr', 'en', 'de', 'es', 'it', 'pl'],
  defaultLocale: 'fr'
};

export default async function middleware(req: NextRequest) {
  // 1. Handle i18n
  const handleI18n = createMiddleware(routing);
  const res = handleI18n(req);

  // 2. Handle Supabase Auth Protection
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
  const protectedRoutes = ['/dashboard', '/studio', '/trophies'];
  const isProtected = protectedRoutes.some(route => path.includes(route));

  if (isProtected) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Extract locale or default to 'fr'
      const locale = path.split('/')[1];
      const validLocale = routing.locales.includes(locale) ? locale : 'fr';
      return NextResponse.redirect(new URL(`/${validLocale}/login`, req.url));
    }
  }

  return res;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
