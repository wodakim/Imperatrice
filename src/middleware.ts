import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from './navigation'; // Updated import to use src/navigation.ts

export default async function middleware(req: NextRequest) {
  // 1. Gérer l'internationalisation (i18n)
  const handleI18n = createMiddleware(routing);
  const res = handleI18n(req);

  // 2. Gérer Supabase Auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // On met à jour la requête ET la réponse
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    }
  );

  // 3. Logique des routes protégées
  // V2: Tout est public sauf /admin et potentiellement /profile
  // Les outils sont en mode Freemium local-first.
  // Je retire /dashboard, /studio, /trophies des routes protégées.
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
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
