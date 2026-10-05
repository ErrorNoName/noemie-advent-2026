# Calendrier d'anniversaire Noémie — 14→21 octobre 2026

Brief actionnable pour un agent **Cursor** (ou équivalent).  
Destinataire du site : **Noémie**. Commanditaire : **Monsieur** (Free Youtube).  
Langue UI : **français**. Tone : tendre, discret, jamais spoiler avant ouverture du jour.

---

## 1. Pitch produit

Site **mobile-first** — calendrier d’avent d’anniversaire (pas de Noël) : **8 cases** du **mardi 14 octobre 2026** au **mercredi 21 octobre 2026** (jour J = anniv).

Chaque jour = un **vrai cadeau physique** que Monsieur offre + une **expérience digitale** (boîte 3D, ouverture, reveal animé, stickers scrapbook).  
Accès secret : lien privé + éventuellement un **code simple** (ex. prénom / date).  
Deploy cible : **Vercel**.

**Important — dates** : aujourd’hui côté box = 5 oct 2026 ; le calendrier doit donc **bloquer** les jours futurs jusqu’à leur date (sauf `?dev=1` pour Monsieur).

---

## 2. Inspirations design (`refs/`)

| Fichier | Réf | À extraire |
|---------|-----|------------|
| `refs/01-gacha-shoko.png` | Gacha Message / Shoko | Machine gachapon 2D crème/rouge/bleu, dial ¥, « OPEN WHEN YOU'RE READY », capsules roses |
| `refs/02-paper-koa-pouch.png` | Paper Koa | Pochette foil argent « Unbox me. », chrome liquid bubbles, shake-to-open |
| `refs/03-lucky-koa-reveal.png` | Lucky Koa | Reveal personnage dans cercle, chrome blobs, boutons download/again |
| `refs/04-admit-two-ticket.png` | admit-two | Ticket stub blush/cream, typo serif élégante |
| `refs/05-mixtape-aesthetic.png` | mixtape lo-fi | Pixel font, cassette, soft teal |
| `refs/06-pacdora-blindbox.png` | Pacdora | Dielines / blind box 3D packaging |

### Esthétique cible
- **Kawaii soft** + **Y2K chrome** + **scrapbook stickers Pinterest**
- Fond crème / blush (`#FFF8F0` / `#FFE4EC`)
- Accents : rose satin, argent chrome, bleu ballon (chrono), rouge gacha doux
- Animations soignées (**Framer Motion** et/ou **GSAP**) — pas de look Bootstrap générique
- Typo : mélange serif élégant (tickets / titres tendres) + display pixel/ballon pour le chrono + sans propre pour le corps

---

## 3. Chrono (header)

- **Grand chrono** en haut : chiffres style **ballons bleus** (foil / balloon digit), gros, lisibles mobile.
- Compte à rebours jusqu’au **prochain déblocage** (minuit Europe/Paris du prochain jour non ouvert), OU jusqu’au **21/10/2026 00:00** si on est encore avant le début — logique claire documentée dans le code.
- Afficher aussi la **date du jour** (ex. « Mardi 14 octobre ») et un petit label « Case X / 8 ».
- Fuseau : **Europe/Paris** (UTC+2 en octobre 2026).

---

## 4. Mémoire & règles d’ouverture

```ts
// localStorage key suggestion
noemie-advent-2026:v1 → {
  opened: { "2026-10-14": true, ... },
  lastVisit: ISO,
  codeOk?: boolean
}
```

Règles :
1. Une case ne s’ouvre **que si** `today (Paris) >= day.date`.
2. Une case **déjà ouverte** reste toujours rejouable (revoir le reveal) — **jamais re-bloquée**.
3. Mode preview Monsieur : `?dev=1` (ou `?preview=all`) débloque tout + badge discret « PREVIEW ».
4. Pas de spoilers texte/images des cadeaux futurs (placeholders neutres / silhouettes).

---

## 5. Les 8 jours (correction de la double « 6ème » de Monsieur)

Source de vérité aussi dans `DAYS.json`.

| # | Date | Label UI | Cadeau physique | UX digitale |
|---|------|----------|-----------------|-------------|
| 1 | 2026-10-14 | Jour 1 | Petite figurine (+ pochette) | Case → teaser noir → clic → **pochette foil** (ref Paper Koa) → shake/reclic → reveal personnage (ref Lucky Koa) |
| 2 | 2026-10-15 | Jour 2 | Squishy satisfaisant | Anim squeeze / bounce / jelly |
| 3 | 2026-10-16 | Jour 3 | Peluche | Reveal soft plush (squash & stretch) |
| 4 | 2026-10-17 | Jour 4 | Machine type gacha (cadeaux dedans) | **Gacha Shoko** : coin → spin dial → capsule tombe → message/cadeau |
| 5 | 2026-10-18 | Jour 5 | Barrette écran LCD cheveux | Mockup LCD pixel « I love U » / « Noémie » |
| 6 | 2026-10-19 | Jour 6 | Panier : bonbons + boisson + mini peluche porte-clés | Layout picnic basket, items qui pop un par un |
| 7 | 2026-10-20 | Jour 7 | Briquet aesthetic fille | Reveal produit cute, chrome/glitter |
| 8 | 2026-10-21 | Jour 8 — Anniversaire | Énorme peluche + fleurs + post-it « je t’aime » + **petit-déj** | Grande scène festive (voir §5.1) |

### 5.1 Jour 8 — petit-déj & scène
Éléments à composer (stickers + illu) :
- Post-it manuscrit **« je t’aime »**
- Éclair chocolat / café
- Gâteau chocolat (**pas** chocolat noir fort — préférer lait / caramel doux)
- Glace café
- Religieuses
- Pêche blanche
- Énorme peluche + bouquet de fleurs
- Ballons chrome + confetti (pins Pinterest)

---

## 6. Flow UI global

1. **Landing** : soft blush, titre discret (« Pour Noémie » / ticket admit-two), champ code optionnel, bouton Entrer.
2. **Calendrier** : grille / rangée de **8 boîtes 3D** numérotées 1→8 (ou dates 14→21). États : locked / available / opened.
3. **Ouverture case** : anim couvercle/porte (CSS 3D ou Three.js léger) → transition vers **scène cadeau** dédiée.
4. **Scène cadeau** : multi-étapes (ex. Jour 1 = 3 clics). Stickers flottants décoratifs.
5. **Retour** au calendrier avec la case marquée ouverte + confetti léger.

---

## 7. Stack technique proposée

- **Vite + React + TypeScript** *ou* Next.js App Router (au choix ; Vite plus simple pour static+Vercel)
- **Tailwind CSS**
- **Framer Motion** (UI) ± **GSAP** (chrono / séquences)
- Boîtes : **CSS 3D** en priorité ; Three.js seulement si vraiment besoin (perf mobile)
- Assets : `/public/refs/`, `/public/stickers/jour-N/`, `/public/stickers/shared/`
- Données : importer `DAYS.json`
- Deploy : Vercel, domaine secret ou path obscure

---

## 8. Stickers Pinterest

### Pins sources (collages déjà téléchargés dans `pins/<id>/collage-original.*`)
1. https://fr.pinterest.com/pin/29836416278745853/ — ballons HAPPY BIRTHDAY chrome, chaton fête, gâteau, Hello Kitty, tulipes  
2. https://fr.pinterest.com/pin/51861833204668772/ — nœuds rose, disco balls, chrome stars, Birthday Girl hats, cerises, kisses  
3. https://fr.pinterest.com/pin/325244404362848109/  
4. https://fr.pinterest.com/pin/14988611255524466/  
5. https://fr.pinterest.com/pin/278519558201523885/  
6. https://fr.pinterest.com/pin/1100778333957365068/  
7. https://fr.pinterest.com/pin/23432860626219894/  

### État harvest
- Collages HD **présents** (CDN, best-effort).
- Stickers découpés RGBA : **pas encore** (dossier `stickers/` vide) — méthode v2 = Remix → Découpages → `mask_transfer.py` (venv prêt sous `/workspace/pinterest-cutouts-sample/.venv`).
- **Cursor peut démarrer** avec placeholders SVG / formes CSS + collages en décor ; remplacer par PNG RGBA quand le pack stickers arrive.
- Structure attendue : `/public/stickers/jour-1/` … `jour-8/` + `shared/` (ballons chrono, confetti, bows).

---

## 9. Livrables attendus de Cursor

1. App complète responsive (priorité iPhone), 8 jours, chrono ballon, persistence localStorage.
2. Animations d’ouverture + 8 scènes cadeau (même si assets placeholders).
3. `README.md` : install, `npm run dev`, deploy Vercel, `?dev=1`.
4. Respect `DAYS.json` + ce BRIEF ; ne pas inventer d’autres cadeaux.
5. Accessibilité basique : focus, labels FR, `prefers-reduced-motion` → anim réduites.
6. Pas de tracking lourd ; pas de partage social public des spoilers.

---

## 10. Prompt Cursor (à coller)

```
Tu construis le site « Calendrier d'anniversaire Noémie » selon BRIEF.md et DAYS.json
dans ce repo. Mobile-first, FR, aesthetic kawaii soft + Y2K chrome + scrapbook
(refs/ + pins/). 8 cases 14→21 oct 2026, chrono ballons bleus, localStorage,
?dev=1 pour preview. Stack Vite+React+TS+Tailwind+Framer Motion. Placeholders
stickers OK si /stickers vide. Ne spoile jamais un jour futur. Deploy-ready Vercel.
Lis BRIEF.md en entier avant de coder.
```

---

## 11. Hors scope (pour plus tard / autre agent)

- Harvest complet Découpages Pinterest (session navigateur connectée).
- Photos réelles des cadeaux physiques de Monsieur (option overlay Jour N).
- Envoi SMS / push le matin — pas requis v1.

---

*Pack généré 2026-10-05 (Europe/Paris). Chemin : `/workspace/noemie-advent-2026/`.*
