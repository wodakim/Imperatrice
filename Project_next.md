# PROJECT NEXT : CORRECTIONS CRITIQUES ET AUDIT V3

Suite à l'audit externe révélant des clés de traduction manquantes et des fonctionnalités incomplètes, ce document liste les corrections prioritaires à effectuer pour atteindre une conformité RÉELLE de 100%.

## CHAPITRE 1 : ACCUEIL & CHRONOBIOLOGIE (CORRECTION)
**Objectif :** Fixer les clés de traduction manquantes dans le widget Chrono.

- [ ] **1.1 Clés i18n Manquantes (Dashboard)**
    - *Fichier cible :* `messages/*.json` et `src/components/dashboard/ChronoWidget.tsx`
    - *Clés à vérifier/ajouter :* `tip_jan` (et tous les mois : `tip_feb`... `tip_dec`), `chrono_prime`, `chrono_good`, `chrono_calm`.
    - *Action :* Vérifier le mappage `month -> key` dans le composant.

## CHAPITRE 2 : STUDIO VIRTUEL (CORRECTION)
**Objectif :** Rétablir les catégories et les traductions du Wizard.

- [ ] **2.1 Catégories & Clés**
    - *Fichier cible :* `src/components/studio/studioData.ts`
    - *Clés manquantes :* `Studio.cat_shoes`, `Studio.cat_bags` (et non `cat_bag`).
    - *Action :* Vérifier que `nameKey` dans `STUDIO_DATA` correspond aux clés JSON.

## CHAPITRE 3 : SEO GENERATOR (CORRECTION UI & KEYS)
**Objectif :** Réparer le style du formulaire (encadrés manquants) et les traductions.

- [ ] **3.1 Styles & UI (Placeholders)**
    - *Fichier cible :* `src/components/seo/SeoGenerator.tsx`
    - *Clés manquantes :* `ph_type`, `ph_details`, `ph_manual_tag`, `pack_select`, `label_preview`.
    - *Problème visuel :* Manque les "encadrés" (borders/styles) sur les inputs "Marque", "Type", etc.
    - *Action :* Ajouter les classes Tailwind `border border-[var(--color-accent)]` aux inputs.

- [ ] **3.2 Données & Boutons**
    - *Clés manquantes :* `btn_remix`, `btn_add`, `desc_magic`, `tags_title`.
    - *Données manquantes :* `seo_data_style.0` (Tableaux de styles).
    - *Action :* S'assurer que le composant sait lire les tableaux imbriqués dans le JSON (ou aplatir la structure si nécessaire).

## CHAPITRE 4 : OUTILS PRATIQUES (CORRECTION)
**Objectif :** Rétablir les traductions et le style des outils.

- [ ] **4.1 Calendrier Saisonnier**
    - *Clés manquantes :* `seasonal_title`, `season_focus.1` (accès tableau), `season_prep_label`.
    - *Action :* Corriger l'accès aux tableaux dans `SeasonalCalendar.tsx`.

- [ ] **4.2 Calculatrice**
    - *Clés manquantes :* `calc_buy_ph`, `calc_sell_ph`, `calc_fees_ph`, `calc_result_label`.
    - *Problème visuel :* Manque encadrés inputs.

- [ ] **4.3 Scripts & Checklist**
    - *Clés manquantes :* `script_select_ph`, `reset_list`, `pack_items.0` à `7`.
    - *Action :* Vérifier la boucle de rendu des items checklist.

## CHAPITRE 5 : DÉTENTE & PANIC (CORRECTION)
**Objectif :** Fixer les textes de la zone Wellness et du Panic Room.

- [ ] **5.1 Textes Relax**
    - *Clés manquantes :* `relax_title`, `relax_subtitle`, `breath_title`, `breath_instruction`, `joke_title`, `btn_next_joke`.
    - *Action :* Vérifier le namespace utilisé (Dashboard vs Relax).

- [ ] **5.2 Panic Room (BONUS)**
    - *Clés manquantes :* `panic_title`, `panic_text`, `anchor_title`, `anchor_5`... `anchor_1`, `btn_better`.
    - *Action :* S'assurer que le composant `PanicRoom` a accès aux bonnes traductions.

## CHAPITRE 6 : JEU CRUSH (REFONTE)
**Objectif :** Rendre le jeu jouable et corriger l'UI.

- [ ] **6.1 UI & Traduction**
    - *Clé manquante :* `btn_new_game`.
    - *Action :* Traduire le bouton.

- [ ] **6.2 Gameplay & UI**
    - *Critique :* "Le système ne fonctionne absolument pas".
    - *Action :* Revoir la logique de Drag & Drop (HTML5 Dnd peut être capricieux sur React). Envisager une logique de "Click A -> Click B" plus robuste pour mobile/desktop. Améliorer le visuel (Grille, animations).

## CHAPITRE 7 : TROPHÉES (CORRECTION)
**Objectif :** Afficher les noms et descriptions corrects.

- [ ] **7.1 Données Trophées**
    - *Clés manquantes :* `tr_n_first_visit`, `tr_d_first_visit`...
    - *Action :* Vérifier la concaténation des clés dans `TrophySystem.tsx`.

---
**MÉTHODE DE TRAVAIL :**
Je traiterai ces chapitres un par un. À la fin de chaque chapitre, je générerai un screenshot de la section concernée pour validation avant de passer au suivant.
