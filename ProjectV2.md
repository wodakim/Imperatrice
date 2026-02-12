# PROJET V2 : PLAN D'EXÉCUTION & AUDIT (L'IMPÉRATRICE)

Ce document sert de référence unique pour l'alignement du projet Next.js sur le prototype `guide/index.html` et la documentation technique.

**OBJECTIF PRIORITAIRE :** Fidélité visuelle "Pixel Perfect" avec le prototype `guide/index.html` tout en maintenant une sécurité (Supabase/CSP) et un SEO irréprochables.

---

## CHAPITRE 0 : SÉCURITÉ, SEO & CONFIGURATION (CRITIQUE)

Avant toute modification visuelle, le socle technique doit être blindé.

- [ ] **0.1 Content Security Policy (CSP)**
    - *Audit:* Vérifier `next.config.ts` ou `middleware.ts`.
    - *Action:* S'assurer que les en-têtes CSP sont stricts (pas d'eval, pas de scripts inline non gérés, img-src sécurisé).
    - *Privacy:* Confirmer l'absence de trackers tiers (Google Analytics, Facebook Pixel).

- [ ] **0.2 SEO Technique & Metadatas**
    - *Audit:* Vérifier `src/app/[locale]/layout.tsx` et `src/lib/utils.ts` (constructMetadata).
    - *Action:*
        - [ ] Titre : "L'IMPÉRATRICE - Assistant Vinted Neuro-Inclusif" (adapté par langue).
        - [ ] Description : Méta description optimisée multilingue.
        - [ ] Viewport : `width=device-width, initial-scale=1, maximum-scale=1` (pour l'effet app native).
        - [ ] JSON-LD : Vérifier le schéma `SoftwareApplication` et `WebApp`.
        - [ ] Canonical URLs : Vérifier la gestion des locales (`x-default`, etc.).

- [ ] **0.3 PWA & Manifest**
    - *Audit:* Vérifier `public/manifest.json`.
    - *Action:* S'assurer que `theme_color` (#FFF0F5 light / #2D2D3A dark), `display: standalone`, et les icônes correspondent au design system.

- [ ] **0.4 Internationalisation (i18n)**
    - *Audit:* Vérifier `src/i18n/routing.ts` et `messages/*.json`.
    - *Action:* S'assurer que les 6 langues (FR, EN, DE, ES, IT, PL) sont configurées et que le fichier JSON contient TOUTES les clés du prototype (y compris les tableaux de données comme `season_focus`, `jokes`, `tips`).

---

## CHAPITRE 1 : UI/UX & NAVIGATION (FIDÉLITÉ VISUELLE)

Le "Look & Feel" doit être indiscernable du prototype HTML.

- [ ] **1.1 Variables CSS & Thèmes**
    - *Audit:* Comparer `src/app/globals.css` avec le `<style>` de `guide/index.html`.
    - *Action:*
        - [ ] Copier EXACTEMENT les valeurs HSL/Hexa des variables (`--bg-color`, `--primary-color`, etc.).
        - [ ] Vérifier la transition `transition-colors duration-300`.
        - [ ] S'assurer que le Dark Mode (`[data-theme='dark']`) applique les bonnes surcharges.

- [ ] **1.2 Layout & Header**
    - *Audit:* `src/components/layout/Header.tsx`.
    - *Action:*
        - [ ] Logo : Typographie et espacement.
        - [ ] Sélecteur de langue : Style "Pill" arrondi, drapeau + code.
        - [ ] Bouton SOS : Animation `pulse-sos` (keyframes exactes).
        - [ ] Toggle Thème : Animation de rotation SVG.

- [ ] **1.3 Barre de Navigation (Tabs)**
    - *Audit:* `src/components/layout/Navigation.tsx`.
    - *Action:*
        - [ ] Scroll horizontal sur mobile (masquer scrollbar).
        - [ ] Style "Pill" : `.nav-tab` (inactif) vs `.nav-tab.active` (fond primaire, texte blanc).
        - [ ] Icônes : Utiliser les SVGs exacts du prototype (Lucide React est proche, mais vérifier la cohérence).
        - [ ] Comportement : Le clic déclenche l'affichage de la section avec animation `fadeIn`.

- [ ] **1.4 Typographie**
    - *Action:*
        - [ ] Font principale : Inter (proche de Segoe UI/Roboto).
        - [ ] Font manuscrite (Post-it) : Caveat (ou Comic Sans MS fallback comme dans le proto).

---

## CHAPITRE 2 : DASHBOARD (WIDGETS)

- [ ] **2.1 Widget "Mes Cuillères"**
    - *Audit:* `src/components/dashboard/SpoonsWidget.tsx`.
    - *Action:*
        - [ ] Logique : Stockage local/Supabase. Reset quotidien automatique.
        - [ ] Visuel : 12 icônes. Clic = Toggle état (Pleine/Vide).
        - [ ] Feedback : Texte contextuel (High/Mid/Low) selon le nombre restant.
        - [ ] Info : Bouton (i) qui révèle le coût énergétique des tâches.

- [ ] **2.2 Widget "Chronobiologie"**
    - *Audit:* `src/components/dashboard/ChronoWidget.tsx`.
    - *Action:*
        - [ ] Algorithme : Implémenter la matrice jour/heure du prototype (`slots`).
        - [ ] États : PRIME (Rouge), GOOD (Violet), NEUTRAL (Gris).
        - [ ] Conseil Saisonnier : Basé sur le mois courant (tableau `season_focus`).

- [ ] **2.3 Widget "Conseil du Jour" (Post-it)**
    - *Audit:* `src/components/dashboard/DailyTip.tsx`.
    - *Action:*
        - [ ] Design : Rotation `-1deg`, ombre portée, fond jaune, punaise CSS.
        - [ ] Contenu : Rotation quotidienne pseudo-aléatoire des conseils (tableau `tips`).

---

## CHAPITRE 3 : STUDIO PHOTO VIRTUEL

- [ ] **3.1 Architecture Wizard**
    - *Audit:* `src/components/studio/*`.
    - *Action:*
        - [ ] État : Gestion de l'étape courante, des étapes validées.
        - [ ] Données : Structure `getPhotoStudioData` (Vêtements, Chaussures, Sacs).

- [ ] **3.2 Interface "Pro Mode"**
    - *Action:*
        - [ ] Carte immersive avec grand visuel/icône.
        - [ ] Zone "Secret Algorithmique" sombre en bas.
        - [ ] Bouton validation : Transition couleur (Primary -> Success) et texte.
        - [ ] Navigation : Bouton "Suivant" n'apparaît qu'après validation.

---

## CHAPITRE 4 : GÉNÉRATEUR SEO

- [ ] **4.1 Formulaire & Logique**
    - *Audit:* `src/components/seo/*`.
    - *Action:*
        - [ ] Inputs : Marque, Type, Couleur, Matière, État, Style.
        - [ ] Génération Procédurale : Moteur d'assemblage (Hook + Reason + State + Details + Closing).
        - [ ] Styles : Casual, Pro, Emoji, Story, Minimal (Drop-down).

- [ ] **4.2 Score SEO**
    - *Action:*
        - [ ] Barre de progression dynamique (Rouge/Jaune/Vert).
        - [ ] Calcul en temps réel (Longueur > 10, Mots-clés, Pénalités mots vides).

- [ ] **4.3 Hashtags & Tendances**
    - *Action:*
        - [ ] Packs Experts : Sélecteur (Gorpcore, Y2K...).
        - [ ] Librairie rapide : Boutons tags (#vintage, #soie...).
        - [ ] Input manuel avec ajout.

---

## CHAPITRE 5 : OUTILS

- [ ] **5.1 Calculatrice Profit**
    - *Action:* Inputs (Achat, Vente, Frais) -> Calcul dynamique Marge/Bénéfice. Code couleur résultat.
- [ ] **5.2 Réponses Magiques**
    - *Action:* Sélecteur de scénario -> Textarea readonly -> Bouton Copier.
- [ ] **5.3 Checklist Colis**
    - *Action:* Liste à cocher persistante. Animation confetti si tout coché.
- [ ] **5.4 Calendrier Saisonnier**
    - *Action:* Affichage "À Vendre" (Now) / "À Préparer" (Next) selon le mois.

---

## CHAPITRE 6 : GAMIFICATION & WELLNESS

- [ ] **6.1 Système de Trophées**
    - *Action:*
        - [ ] Trigger : Débloquer les trophées sur actions (visite, clic, score).
        - [ ] Notification : Toast "Succès débloqué".
        - [ ] Vue Trophées : Grille (Grisé = Verrouillé, Coloré = Débloqué).

- [ ] **6.2 Jeu "Crush"**
    - *Action:*
        - [ ] Implémentation React du Match-3 (ou portage direct du canvas/dom logic si plus simple).
        - [ ] High Score persistant.

- [ ] **6.3 Zone Détente**
    - *Action:*
        - [ ] Cohérence Cardiaque : Animation CSS cercle (`scale` sur 8s).
        - [ ] Blagues : Générateur aléatoire.

- [ ] **6.4 SOS Panic Room**
    - *Action:*
        - [ ] Overlay plein écran.
        - [ ] Texte rassurant + Technique 5-4-3-2-1.
        - [ ] Bouton de sortie.

---

## CHAPITRE 7 : SYNC & DATA (SUPABASE)

- [ ] **7.1 Stratégie Hybride**
    - *Action:*
        - [ ] Hook `useSyncStore` : Lire localStorage d'abord (Guest), Sync Supabase en background (Auth).
        - [ ] Tables : Vérifier structure `profiles` (champs jsonb pour trophées/progress).

---

## VALIDATION FINALE
- [ ] Audit visuel complet comparatif (Split screen : Localhost vs Prototype).
- [ ] Audit Lighthouse (Perf, Accessibility, SEO).
