import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from './i18n/routing'; // <-- On importe ta config unique

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
  const path = req.nextUrl.pathname;
  const protectedRoutes = ['/dashboard', '/studio', '/trophies'];
  
  // On vérifie si le chemin contient une route protégée
  const isProtected = protectedRoutes.some(route => path.includes(route));

  if (isProtected) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Récupérer la locale depuis l'URL (ex: /fr/dashboard -> fr)
      // Si l'URL ne commence pas par une locale connue, on met 'fr' par défaut
      const localeSegment = path.split('/')[1];
      const validLocale = routing.locales.includes(localeSegment as any) ? localeSegment : routing.defaultLocale;
      
      // On redirige vers la page de login avec la bonne locale
      return NextResponse.redirect(new URL(`/${validLocale}/login`, req.url));
    }
  }

  return res;
}

export const config = {
  // Matcher standard pour next-intl
  matcher: ['/((?!api|_next|_vercel|.*\\..*|auth).*)']
};
