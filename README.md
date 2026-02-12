# L'IMPÉRATRICE 👑

Assistant personnel de vente pour Vinted (Neuro-inclusif & SEO-first).

## 🛠️ Installation

1.  **Cloner le projet**
    ```bash
    git clone https://github.com/votre-user/limperatrice.git
    cd limperatrice
    ```

2.  **Installer les dépendances**
    ```bash
    npm install
    ```

3.  **Configuration**
    Copiez le fichier `.env.example` en `.env.local` et remplissez les valeurs :
    ```bash
    cp .env.example .env.local
    ```
    *   `NEXT_PUBLIC_SUPABASE_URL`: Votre URL de projet Supabase.
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Votre clé publique (anon).

4.  **Base de Données (Supabase)**
    Allez dans l'éditeur SQL de Supabase et exécutez le contenu du fichier `supabase_schema.sql` fourni à la racine.
    Cela créera :
    *   La table `profiles`
    *   Les politiques de sécurité (RLS)
    *   Les triggers pour la création automatique de profil

5.  **Lancer le serveur de développement**
    ```bash
    npm run dev
    ```
    Ouvrez [http://localhost:3000](http://localhost:3000).

## 🚀 Fonctionnalités Clés

*   **Studio Photo** : Guide interactif avec overlay caméra (Client-side).
*   **Générateur SEO** : Titres et descriptions optimisés pour l'algo Vinted.
*   **Outils** : Calculatrice de profit, Checklist colis, Scripts de réponse.
*   **Gamification** : Système de cuillères (énergie) et Trophées.
*   **Internationalisation** : Support FR, EN, DE, ES, IT, PL.

## 🏗️ Architecture

*   **Framework** : Next.js 14 (App Router)
*   **Langage** : TypeScript
*   **Styles** : Tailwind CSS v4 (Thèmes Pastel/Dark)
*   **Auth/DB** : Supabase
*   **i18n** : next-intl

## 🔐 Sécurité & Données

*   Les données sensibles sont protégées par RLS (Row Level Security).
*   **Smart Sync** : Les données locales (localStorage) sont fusionnées avec le profil lors de la connexion.
*   **Privacy First** : Aucun cookie tiers par défaut.

## 🤝 Contribution

Projet développé par Jules (Agent IA) pour L'Impératrice.
