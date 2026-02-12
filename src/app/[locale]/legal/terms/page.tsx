export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)]">
      <h1 className="text-3xl font-bold mb-6 text-[var(--color-primary-dark)]">Conditions Générales d'Utilisation (CGU)</h1>

      <p className="mb-6 italic text-[var(--color-text-muted)]">Dernière mise à jour : {new Date().toLocaleDateString()}</p>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">1. Accès au Service</h2>
        <p className="mb-2">L'IMPÉRATRICE est une application d'aide à la vente. L'accès est gratuit (Freemium) avec des fonctionnalités payantes potentielles à l'avenir.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">2. Responsabilité</h2>
        <p className="mb-2">L'utilisateur est seul responsable de l'utilisation qu'il fait des outils (Générateur SEO, Calculateurs).</p>
        <p className="text-[var(--color-text-muted)]">Nous ne garantissons pas de résultats de vente spécifiques.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">3. Propriété Intellectuelle</h2>
        <p className="mb-2">Le contenu, design, et code source sont la propriété exclusive de l'éditeur.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">4. Modification des CGU</h2>
        <p className="text-[var(--color-text-muted)]">Nous nous réservons le droit de modifier les présentes à tout moment.</p>
      </section>
    </div>
  );
}
