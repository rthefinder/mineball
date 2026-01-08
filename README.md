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
