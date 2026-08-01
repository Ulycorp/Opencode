---
name: responsive-ui
description: >-
  Adapter une interface aux tailles, densités et modes d’entrée variés. Utiliser pour toute page ou composant destiné à plusieurs fenêtres ou appareils.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Interface responsive

## Méthode

1. Définir priorités de contenu et contraintes intrinsèques avant les breakpoints.
2. Construire des layouts fluides avec tailles flexibles, wrapping et conteneurs.
3. Tester contenu long, zoom, orientation, clavier, tactile et densités représentatives.
4. Corriger débordements, ordre visuel, cibles tactiles et comportements extrêmes.

## Gates

- Aucune fonctionnalité critique ne doit disparaître sur petit écran.
- Le zoom texte et navigateur ne doit pas casser le parcours principal.

## Livrables et contrats

- UI fluide et matrice de vérification sur tailles représentatives.

## Anti-patterns

- Concevoir uniquement pour trois captures fixes.
- Réduire la police ou les cibles pour faire tenir le contenu.
