import { useTranslations } from 'next-intl';

export default function HomePage() {
  // On utilise useTranslations pour vérifier que l'i18n fonctionne
  // Si tu n'as pas encore de clé dans tes fichiers json, tu peux retirer cette ligne et juste mettre du texte brut dans le <h1>
  const t = useTranslations(); 

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>L'Impératrice est en ligne 👑</h1>
      <p>Locale actuelle détectée par le dossier.</p>
    </div>
  );
}
