# L'IMPÉRATRICE - Refonte Finale

## Objectif (Phase 2 - Production Réelle)
Transformer l'application Next.js actuelle en une **Web App (PWA) de production**, payante (modèle Freemium strict), synchronisée en temps réel (Supabase), et visuellement indiscernable du prototype original (HTML/CSS/JS) tout en étant neuro-inclusive.

---

## 1. Architecture & Accès (Freemium Paywall)
- [ ] **Auth Gate & Payment Lock:**
  - L'application est accessible en mode "Visiteur" (Gratuit) mais **bridée**.
  - Les fonctionnalités clés (Résultats Calculatrice, Suite du Guide Photo, Niveaux Crush > 5, Historique Trophées) sont floutées ou bloquées.
  - Un bouton "Débloquer l'expérience complète (X€)" déclenche une modale de paiement (Simulation ou Stripe Test).
  - Une fois payé -> Création de compte/Login autorisé -> Accès Full.
- [ ] **Role Management:**
  - `user_role`: 'free', 'premium', 'admin'.

## 2. Synchronisation Données (Real-Time)
- [ ] **Migrer `useLocalStorage` vers `useSyncStore`:**
  - Créer un hook unifié qui :
    1. Lit/Ecrit en local (Optimistic UI) pour la rapidité.
    2. Pousse en background vers Supabase (`profiles` table) si l'utilisateur est connecté (Premium).
    3. Gère les conflits (Last Write Wins).
  - Champs à sync: `spoons` (int), `unlocked_trophies` (jsonb), `crush_high_score` (int), `packing_list_state` (jsonb).

## 3. Parité Visuelle & UX (Deep Polish)
- [ ] **Audit "Pixel Perfect":**
  - Re-vérifier chaque ombre (`box-shadow`), chaque arrondi (`border-radius`), chaque transition du `prototype/index.html`.
  - Intégrer les micro-interactions manquantes (effets de survol spécifiques, animations d'apparition).
  - S'assurer que le mode "Panic Room" et "Relax" sont exactement comme l'original (couleurs, timings respiration).
- [ ] **Accessibilité Neuro-Inclusive:**
  - Vérifier les contrastes (WCAG AA).
  - Désactiver les animations trop fortes si `prefers-reduced-motion`.
  - Wording doux et bienveillant partout (vérifier les traductions).

## 4. PWA & Offline
- [ ] **Manifest & Service Workers:**
  - `manifest.json` complet (Icons, Theme Color, Standalone).
  - Configuration `next-pwa` ou équivalent pour le cache offline des assets et du shell.
  - Bouton "Installer l'app" dans le Header/Settings.

## 5. Admin Dashboard
- [ ] **Route `/admin` (Protégée RLS):**
  - KPI : Nombre d'utilisateurs, % Premium, Spoons moyens.
  - Gestion simple des utilisateurs (Ban/Unban/Gift Premium).

---

## Boucle de Travail

1.  **Analyse:** Je lis une tâche du `project.md`.
2.  **Planification:** Je t'explique comment je vais l'implémenter techniquement.
3.  **Validation:** J'attends ton "GO".
4.  **Exécution:** Je code et je teste.
5.  **Audit:** Je vérifie que cela correspond au prototype `guide/index.html` (mon `prototype/index.html` local).
