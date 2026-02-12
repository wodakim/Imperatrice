import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { Inter, Caveat } from 'next/font/google';
import clsx from 'clsx';
import PanicRoom from '@/components/layout/PanicRoom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import '../globals.css';
import { constructMetadata } from '@/lib/utils';
import { JsonLd, generateSoftwareAppSchema } from '@/components/seo/JsonLd';
import CookieBanner from '@/components/layout/CookieBanner';
import LoginModal from '@/components/auth/LoginModal';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat' });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return constructMetadata({ locale });
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <JsonLd data={generateSoftwareAppSchema(locale)} />
      </head>
      <body className={clsx(inter.variable, caveat.variable, "antialiased min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] font-sans transition-colors duration-300")}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
            <PanicRoom />
            <LoginModal />
            <div className="max-w-4xl mx-auto p-5 pb-32">
              <Header />
              <Navigation />
              <main className="mt-5 animate-fade-in">
                {children}
              </main>
              <CookieBanner />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
