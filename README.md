# Pour Noémie

Calendrier d’anniversaire mobile, du **14 au 21 octobre 2026** (huit cases, heure de Paris). Chaque jour ouvre une petite scène : pochette foil, squishy, peluche, machine gacha, barrette LCD, panier, briquet, puis le matin de l’anniversaire.

Le ton reste tendre. Une case future ne montre pas son cadeau.

## Lancer

```bash
npm i
npm run dev
```

Le site écoute sur [http://127.0.0.1:43123](http://127.0.0.1:43123).

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

## Stickers

`public/stickers/jour-1/` … `jour-8/` et `public/stickers/shared/` sont branchés via `public/stickers/manifest.json`. Les SVG déjà là sont des placeholders. Pour les remplacer par des découpes : dépose les PNG dans le dossier du jour et ajoute le nom du fichier dans le manifeste. Les collages Pinterest (`public/pins/`) servent de chutes scrapbook.

`refs/`, `pins/` et `stickers/` à la racine pointent vers `public/`.

## Accessibilité

Les boutons ont un libellé en français. `prefers-reduced-motion` coupe les boucles (secousse, flamme, glitch) et raccourcit les gestes : la pochette s’ouvre en un toucher, le squishy reste pressable.
