---
name: shopify-performance
description: >-
  Mesurer et améliorer la performance d’un storefront Shopify. Utiliser pour thème lent, assets lourds ou gate de release.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shopify"
  version: "1.0.0"
---

# Performance Shopify

## Méthode

1. Mesurer pages et données représentatives avec réseau/appareil définis.
2. Identifier coût Liquid, applications, scripts tiers, images, CSS et JavaScript.
3. Prioriser suppression/différé, images responsives, chargement conditionnel et cache.
4. Comparer avant/après et vérifier conversion, tracking autorisé et éditeur de thème.

## Gates

- Une app ou script tiers doit justifier son coût sur les parcours critiques.
- Ne pas retarder une information indispensable à l’achat.

## Livrables et contrats

- Baseline, changements mesurés et budget performance du thème.

## Anti-patterns

- Optimiser seulement une boutique vide.
- Charger globalement un asset utilisé sur une seule section.
