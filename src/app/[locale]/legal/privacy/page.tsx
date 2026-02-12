export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)]">
      <h1 className="text-3xl font-bold mb-6 text-[var(--color-primary-dark)]">Politique de Confidentialité</h1>

      <p className="mb-6 italic text-[var(--color-text-muted)]">Dernière mise à jour : {new Date().toLocaleDateString()}</p>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">1. Collecte des Données</h2>
        <p className="mb-2">Nous collectons les données suivantes uniquement pour le fonctionnement du service :</p>
        <ul className="list-disc pl-5 text-[var(--color-text-muted)] space-y-1">
            <li>Données d'inscription (Email, ID Supabase)</li>
            <li>Données de jeu (Scores, Trophées)</li>
            <li>Préférences (Thème, Langue)</li>
        </ul>
        <p className="mt-2 text-sm">Nous ne revendons AUCUNE donnée à des tiers.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">2. Utilisation des Cookies</h2>
        <p className="mb-2">Ce site utilise uniquement des cookies <strong>strictement nécessaires</strong> au fonctionnement :</p>
        <ul className="list-disc pl-5 text-[var(--color-text-muted)] space-y-1">
            <li>Session d'authentification (Supabase)</li>
            <li>Préférence de langue (next-intl)</li>
            <li>Préférence de thème (next-themes)</li>
        </ul>
        <p className="mt-2 text-sm font-bold">Aucun traceur publicitaire ou d'analyse (Google Analytics, Facebook Pixel) n'est installé.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">3. Vos Droits (RGPD)</h2>
        <p className="mb-2">Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.</p>
        <p className="text-[var(--color-text-muted)]">Pour exercer ce droit, contactez-nous à : [VOTRE EMAIL]</p>
      </section>
    </div>
  );
}
