import { useTranslations } from 'next-intl';

export default function MentionsPage() {
  const t = useTranslations('Legal');
  // Assuming 'Legal' namespace exists or fallback to generic

  return (
    <div className="max-w-2xl mx-auto py-10 px-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)]">
      <h1 className="text-3xl font-bold mb-6 text-[var(--color-primary-dark)]">Mentions Légales</h1>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">1. Éditeur du Site</h2>
        <p className="mb-2">Le site L'IMPÉRATRICE est édité par :</p>
        <ul className="list-disc pl-5 text-[var(--color-text-muted)]">
          <li>Nom de la Société / Entrepreneur : [VOTRE NOM]</li>
          <li>Adresse : [VOTRE ADRESSE]</li>
          <li>SIRET : [NUMERO SIRET]</li>
          <li>Email de contact : [VOTRE EMAIL]</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">2. Hébergement</h2>
        <p className="mb-2">Le site est hébergé par :</p>
        <ul className="list-disc pl-5 text-[var(--color-text-muted)]">
          <li><strong>Vercel Inc.</strong></li>
          <li>Adresse : 340 S Lemon Ave #4133 Walnut, CA 91789, USA</li>
          <li>Base de données : <strong>Supabase Inc.</strong></li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">3. Propriété Intellectuelle</h2>
        <p className="text-[var(--color-text-muted)]">
          L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.
        </p>
      </section>
    </div>
  );
}
