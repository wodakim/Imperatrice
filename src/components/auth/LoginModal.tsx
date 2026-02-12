'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { X, Lock } from 'lucide-react';

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');

  const supabase = createClient();
  const router = useRouter();
  const t = useTranslations('Auth');

  useEffect(() => {
    // Listen for global login trigger
    const handleTrigger = () => setIsOpen(true);
    window.addEventListener('openLoginModal', handleTrigger);
    return () => window.removeEventListener('openLoginModal', handleTrigger);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setIsOpen(false);
        router.refresh();
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === 'Wodadmin' && adminPass === '75894631Kado') {
        // Mock Login Success
        // In real app we would use a real account or a specific admin flag
        // Here we just close and maybe set a local admin flag for UI (not secure but meets "prototype" requirement)
        localStorage.setItem('admin_bypass', 'true');
        setIsOpen(false);
        alert("Mode Admin Activé (Local)");
        router.refresh();
    } else {
        alert("Identifiants incorrects");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[var(--color-surface)] w-full max-w-md p-6 rounded-2xl shadow-2xl relative border border-[var(--color-accent)]">
        <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
        >
            <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-2 text-[var(--color-primary-dark)]">
            {t('login_title')}
        </h2>
        <p className="text-center text-sm text-[var(--color-text-muted)] mb-6">
            Connectez-vous pour sauvegarder votre progression.
        </p>

        {!isAdminMode ? (
            <>
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
                            }
                        }
                    }}
                />
                <button
                    onClick={() => setIsAdminMode(true)}
                    className="w-full mt-4 text-xs text-center text-[var(--color-text-muted)] hover:underline flex items-center justify-center gap-1"
                >
                    <Lock size={12} /> Accès Admin
                </button>
            </>
        ) : (
            <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Identifiant"
                    className="p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-accent)] outline-none"
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    className="p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-accent)] outline-none"
                    value={adminPass}
                    onChange={e => setAdminPass(e.target.value)}
                />
                <button type="submit" className="bg-[var(--color-secondary)] text-white font-bold py-3 rounded-xl hover:opacity-90">
                    Connexion Admin
                </button>
                <button
                    type="button"
                    onClick={() => setIsAdminMode(false)}
                    className="text-sm text-center text-[var(--color-text-muted)] underline"
                >
                    Retour
                </button>
            </form>
        )}
      </div>
    </div>
  );
}
