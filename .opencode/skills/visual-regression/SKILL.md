---
name: visual-regression
description: >-
  Détecter des changements visuels involontaires. Utiliser pour composants stables, pages critiques et migrations CSS.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Régression visuelle

## Méthode

1. Choisir des états représentatifs et figer viewport, données, polices et animations.
2. Capturer une baseline approuvée dans un environnement reproductible.
3. Comparer les rendus avec seuil adapté et inspecter chaque différence.
4. Mettre à jour la baseline uniquement après validation fonctionnelle et visuelle.

## Gates

- Une différence attendue doit être reliée au changement qui la justifie.
- Les captures instables doivent être corrigées, pas simplement tolérées.

## Livrables et contrats

- Scénarios de capture, diffs et baseline validée.

## Anti-patterns

- Capturer chaque page sans valeur de régression.
- Accepter automatiquement toutes les nouvelles images.
