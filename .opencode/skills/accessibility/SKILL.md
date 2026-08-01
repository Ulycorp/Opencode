---
name: accessibility
description: >-
  Concevoir ou auditer une expérience Web accessible. Utiliser pour toute UI, composant interactif, contenu ou gate de livraison.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Accessibilité Web

## Méthode

1. Utiliser HTML sémantique et nom, rôle, valeur accessibles avant tout ARIA.
2. Vérifier ordre de focus, clavier, focus visible, erreurs et annonces dynamiques.
3. Contrôler contraste, zoom, reflow, texte alternatif et médias.
4. Combiner analyse automatisée avec parcours manuel clavier et arbre d’accessibilité.

## Gates

- Aucune action critique ne doit dépendre uniquement de la souris, couleur ou animation.
- Un contrôle personnalisé doit reproduire complètement le comportement natif attendu.

## Livrables et contrats

- Constats classés, correctifs et preuves de vérification accessibilité.

## Anti-patterns

- Ajouter ARIA pour compenser un élément HTML mal choisi.
- Déclarer conforme sur la seule base d’un scanner.
