---
name: web-performance
description: >-
  Mesurer et améliorer la performance Web réelle. Utiliser pour Core Web Vitals, bundle, rendu, cache, images ou régression de vitesse.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Performance Web

## Méthode

1. Définir parcours, appareils, réseau, données et métriques représentatifs.
2. Mesurer baseline laboratoire et signaux terrain disponibles; localiser le coût principal.
3. Optimiser le goulot dominant côté rendu, réseau, données, assets ou cache.
4. Comparer avant/après, vérifier UX et prévenir la régression par budget.

## Gates

- Toute amélioration annoncée doit être mesurée dans des conditions comparables.
- Ne pas dégrader accessibilité, exactitude ou fraîcheur sans compromis explicite.

## Livrables et contrats

- Rapport de mesures, changement ciblé et budget de performance.

## Anti-patterns

- Optimiser un score unique sans impact utilisateur.
- Charger prématurément toutes les ressources.
