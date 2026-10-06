# Pour Noémie

Calendrier d’anniversaire mobile, du **14 au 21 octobre 2026** (huit cases, heure de Paris). Chaque jour ouvre une petite scène : pochette foil, squishy, peluche, machine gacha, barrette LCD, panier, briquet, puis le matin de l’anniversaire.

Le ton reste tendre. Une case future ne montre pas son cadeau.

## Lancer

```bash
npm i
npm run dev
```

Le site écoute sur [http://127.0.0.1:43123/noemie-advent-2026/](http://127.0.0.1:43123/noemie-advent-2026/). Vite sert le dossier avec `base: '/noemie-advent-2026/'`, le même chemin que GitHub Pages.

```bash
npm test
npm run build
npm run preview
```

## Entrer

Le portail demande le prénom de la destinataire (`DAYS.json` → `recipient`), sans tenir compte des accents ni de la casse. Ce n’est pas un mot de passe : c’est un seuil doux, tout est dans le navigateur.

Les cases déjà ouvertes sont mémorisées dans `localStorage`, clé `noemie-advent-2026:v1`. Une case ouverte reste rejouable.

## Preview

`?dev=1` ou `?preview=all` débloque les huit cases et affiche un badge **PREVIEW**. Le compte à rebours, lui, suit toujours la vraie date.

`/test` ou `?test=1` ouvre les huit cases tout de suite (couvercles ouverts), sans le portail. Le bouton **Réinitialiser** efface `localStorage`. Sur GitHub Pages, `/test` passe par `404.html`, qui renvoie vers l’application.

## Compte à rebours

Fuseau **Europe/Paris**.

- Avant le 14 octobre 2026, 00:00 : jusqu’au premier matin.
- Ensuite : jusqu’au minuit du prochain jour encore fermé.
- À partir du 21 octobre 2026, 00:00 : le chrono s’arrête. Joyeux anniversaire.

La logique est commentée dans `src/lib/time.ts`.

## Déployer sur Vercel

1. Importer le dépôt. Vercel détecte Vite.
2. Build : `npm run build`. Dossier de sortie : `dist`.
3. Aucune variable d’environnement.
4. Le site est en `noindex`. Garde le lien pour vous deux.

## Lettres découpées

Les titres (Noémie, Pour toi, Jour N, les dates, Souvenirs, Joyeux anniversaire) sont composés en collage : découpes Pinterest pour W, E, I, N, O, R et S, glyphes papier Resource Boy pour le reste. La licence Resource Boy est dans `public/letters/LICENSE-ResourceBoy.txt`. Le chiffre 8, absent du jeu, est un petit carton dans la police du texte. Un accent (É) est la lettre E plus une marque papier, pas un emoji.

## Stickers d’ouverture

`public/stickers/experience/` garde les 50 découpes communes et les stickers de chaque jour. Ils restent dans les rails de 42 px, ou dans une rangée sous le cadeau une fois qu’il est ouvert : ils se décollent l’un après l’autre, avec une petite ombre. Le premier se laisse tirer dans cette rangée, le deuxième s’agite au toucher. Rien ne passe sur le titre ni sur le cadeau. Le jour 7 ne pose pas un second briquet.

## Souvenirs

Trente photos dans `public/souvenirs/` (album 1 : 6, album 2 : 24), au plus 1600 px. Les jours 2, 4, 6 et 8 déclenchent un vrai appareil après le cadeau : Hello Kitty, Cyber-shot rose, Cyber-shot argent, Canon étoilé. Un appui fait un flash, et la photo se développe dans l’écran. La galerie Souvenirs, depuis l’accueil, ouvre chaque tirage débloqué dans un autre appareil (téléphone, iPod, télé, console…), tenu par un nœud, une punaise ou une pince. Le trombone et le petit téléphone vertical restent petits. Les rectangles d’écran sont dans `src/data/devices.json`. `/test` ouvre tous les jours.

## Stickers

Les cadeaux réels sont dans `public/stickers/jour-1/` … `jour-8/` (WebP, fond transparent). Les pochettes découpées sont dans `public/stickers/packages/`. Le décor vient des découpages Pinterest dans `public/stickers/decor/from-pinterest/`. Les chiffres du compte à rebours restent les ballons foil `public/timer/digit-0.webp` … `digit-9.webp`. Pas de collage entier, pas d’emoji.

## GitHub Pages

Le dépôt public prévu est `noemie-advent-2026`. Le workflow `.github/workflows/pages.yml` construit `dist` et le publie. L’adresse est `https://<compte>.github.io/noemie-advent-2026/` et le mode test `https://<compte>.github.io/noemie-advent-2026/test`.

`refs/`, `pins/` et `stickers/` à la racine pointent vers `public/`.

## Accessibilité

Les boutons ont un libellé en français. `prefers-reduced-motion` coupe les boucles (secousse, flamme, glitch) et raccourcit les gestes : la pochette s’ouvre en un toucher, le squishy reste pressable.
