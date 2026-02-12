'use client';

import { createClient } from '@/lib/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('Auth');
  const supabase = createClient();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-[var(--color-surface)] p-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)] border border-[var(--color-accent)]">
        <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-primary-dark)]">
          {t('login_title')}
        </h2>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'var(--color-primary-dark)',
                  brandAccent: 'var(--color-primary)',
                  inputBackground: 'var(--color-bg)',
                  inputText: 'var(--color-text-main)',
                  inputBorder: 'var(--color-accent)',
                  messageText: 'var(--color-text-muted)',
                  dividerBackground: 'var(--color-accent)',
                },
                radii: {
                  borderRadiusButton: '12px',
                  buttonBorderRadius: '12px',
                  inputBorderRadius: '12px',
                },
              },
            },
            className: {
              container: 'auth-container',
              button: 'auth-button',
              input: 'auth-input',
            }
          }}
          providers={['google']}
          localization={{
            variables: {
              sign_in: {
                email_label: t('email_label'),
                password_label: t('password_label'),
                button_label: t('signin_button'),
              },
              sign_up: {
                button_label: t('signup_button'),
              }
            }
          }}
        />
      </div>
    </div>
  );
}
