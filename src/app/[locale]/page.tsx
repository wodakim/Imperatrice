import { redirect } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // On attend que les paramètres soient chargés (spécifique à Next.js 15/16)
  const { locale } = await params;

  // On redirige l'utilisateur vers le dashboard tout en gardant sa langue
  redirect(`/${locale}/dashboard`);
}
