# mineball

Mineball is a crypto-native, mining-inspired flywheel meme coin and visual identity focused on growth, block-by-block accumulation, and compounding value. This repository contains the primary vector assets and usage guidance for the project logo system.

## Project concept

- Name: `mineball` (lowercase preferred).
- Concept: a snowball / flywheel made of stacked blocks — representing mining, accumulation, and compounding value. Visual cues include stacked/rotating blocks, subtle mining tools/veins (abstract), and circular motion to suggest a flywheel.
- Mood: progressive, compounding, game-like, systemic — fun but serious.

## Repository contents

- `assets/mineball_icon.svg` — primary symbol (vector).
- `assets/mineball_icon_circle.svg` — circular PFP variant (vector).
- `assets/mineball_wordmark.svg` — simplified symbol + blocky lowercase wordmark (vector).
- `ASSETS_README.md` — assets usage notes and palette.

## Design brief (summary)

- Style: pixel-inspired but modern — clean, blocky, geometric, not cartoonish.
- Core shapes: ball or cube composed of blocks, stacked or rotating blocks to imply growth.
- Accents: subtle pickaxe abstraction, ore veins, and optional glow for valuable resources.
- Typography: blocky sans-serif / pixel-like; lowercase `mineball`; highly legible at small sizes.
- Composition: square or circular symbol, strong silhouette, centered and balanced, works as PFP/token icon/dashboard logo.
- Constraints: do not copy Minecraft logos/textures; avoid copyrighted fonts/icons; keep assets original and abstract.

## Color palette

- Stone gray: `#7d7d7d`
- Dirt brown: `#7a5230`
- Emerald accent: `#0dbf7a`
- Diamond blue accent: `#2aa7ff`

Flat colors or very light shading are preferred. Use a subtle glow on resource elements when needed.

## How to export PNGs from the SVGs

Create a `dist` folder first:

```bash
mkdir -p dist
```

Recommended exports (example commands):

With Inkscape:

```bash
inkscape assets/mineball_icon_circle.svg -w 512 -h 512 -o dist/mineball_icon_circle_512.png
inkscape assets/mineball_icon.svg -w 256 -h 256 -o dist/mineball_icon_256.png
```

With `rsvg-convert` (headless/CI friendly):

```bash
rsvg-convert -w 512 -h 512 assets/mineball_icon_circle.svg -o dist/mineball_icon_circle_512.png
rsvg-convert -w 256 -h 256 assets/mineball_icon.svg -o dist/mineball_icon_256.png
```

Small sizes for token icons: export at 16, 24, 32, 48, 64 px and test legibility.

## Typical workflow (dev/designer)

1. Edit or add SVGs under `assets/`.
2. Validate appearance at target sizes (16–512 px).
3. Export to `dist/` using the commands above.
4. Stage and commit changes:

```bash
git add assets/ ASSETS_README.md README.md
git commit -m "Add/update logo assets and README"
git push origin main
```

5. Open a pull request if working from a feature branch.

## Contribution guidelines

- Work on a feature branch and open a PR.
- Respect the palette, silhouette, and readability constraints.
- Do not import or trace copyrighted game assets.
- Provide PNG exports for each SVG change to confirm small-size readability.

## Next steps / options I can perform

- Export PNGs at standard sizes (16, 32, 64, 128, 256, 512). Specify which sizes and I will create and add them to `dist/`.
- Produce light-background variants and optimized token icons.
- Create a subtle animated preview (GIF or Lottie) for demo purposes.

---

If you confirm, I will update the `dist/` folder with PNG exports at your requested sizes and push those changes to the repository.
# mineball

Mineball est un projet de crypto-monnaie « flywheel » inspiré par l'imagerie minière, la progression bloc par bloc et l'accumulation composée. Le logo et les assets visent un rendu pixelisé-modernisé, propre et géométrique, adapté aux profils, tokens et interfaces.

## Contenu du dépôt

- `assets/mineball_icon.svg` — symbole principal (vectoriel).
- `assets/mineball_icon_circle.svg` — variante circulaire (PFP, vectoriel).
- `assets/mineball_wordmark.svg` — symbole + logotype en style blocky (vectoriel).
- `ASSETS_README.md` — notes d'usage et palette de couleurs.

## Objectifs du projet

- Créer une identité visuelle crypto-native (logo, PFP, wordmark).
- Fournir des assets vectoriels propres, utilisables pour token icons, dashboards et posters.
- Offrir variantes exportées (PNG) et versions pour fonds clairs/sombres.

## Instructions rapides — exporter des PNG

Deux méthodes courantes depuis SVG :

- Avec Inkscape (recommandé si installé) :

```bash
inkscape assets/mineball_icon_circle.svg -w 512 -h 512 -o dist/mineball_icon_circle_512.png
inkscape assets/mineball_icon.svg -w 256 -h 256 -o dist/mineball_icon_256.png
```

- Avec rsvg-convert (headless, utile en CI) :

```bash
rsvg-convert -w 512 -h 512 assets/mineball_icon_circle.svg -o dist/mineball_icon_circle_512.png
rsvg-convert -w 256 -h 256 assets/mineball_icon.svg -o dist/mineball_icon_256.png
```

Créez le dossier `dist` avant d'exporter si nécessaire :

```bash
mkdir -p dist
```

## Palette et style

- Stone gray : `#7d7d7d`
- Dirt brown : `#7a5230`
- Emerald accent : `#0dbf7a`
- Diamond blue accent : `#2aa7ff`

Style général : pixel-inspired mais moderne, formes géométriques, contours propres, faible ombrage, options avec lueur subtile pour les ressources.

## Étapes de développement (workflow)

1. Modifier ou ajouter des assets SVG dans `assets/`.
2. Tester l'apparence à différentes tailles (16–512 px).
3. Exporter PNGs dans `dist/` avec les commandes ci-dessus.
4. Ajouter, committer et pousser les changements :

```bash
git add assets/ ASSETS_README.md README.md
git commit -m "Update README and add logo assets"
git push origin main
```

5. Ouvrir une Pull Request si vous travaillez sur une branche.

## Contribuer

- Forkez le dépôt ou travaillez sur une branche dédiée.
- Respectez la palette et le style : pas d'assets copiés depuis des jeux existants.
- Vérifiez la lisibilité à petite taille pour toutes les variantes.

## Remarques design

- Le symbole principal est conçu pour fonctionner seul (PFP) et avec le wordmark.
- Veillez à garder un fort contraste pour les icônes token (fond sombre ou clair selon la variante).
- Ne pas utiliser de polices sous licence sans vérification ; les assets fournis utilisent des formes vectorielles personnalisées.

## Reste à faire (options disponibles)

- Exporter PNG/ICO à des tailles standards (16, 32, 64, 128, 256, 512).
- Générer variantes pour fonds clairs.
- Fournir une animation simple (GIF ou Lottie) pour présentation.

---

Si vous voulez que j'exporte des PNG à des tailles précises ou que je pousse aussi les fichiers `dist/` générés, dites-moi quelles tailles et je m'en occupe.
# mineball
mineball is a flywheel-style meme coin inspired by the idea of mining, progression, and compounding — similar to a Minecraft-style economy.
