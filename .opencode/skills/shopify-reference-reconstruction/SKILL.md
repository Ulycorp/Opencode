---
name: shopify-reference-reconstruction
description: >-
  Transformer URL, screenshots, code ou documents de référence en spécification Shopify réutilisable. Utiliser avant de reconstruire une expérience existante.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shopify"
  version: "1.0.0"
---

# Reconstruction depuis références Shopify

## Méthode

1. Inventorier sources, pages, états, viewports et éléments disponibles.
2. Séparer observation, structure, comportement, contenu, identité et éléments légalement réutilisables.
3. Cartographier pages, composants, assets, interactions et équivalents Shopify.
4. Produire une spécification de reconstruction priorisée avec inconnues et validations.

## Gates

- Ne pas copier aveuglément code, marque, contenu ou asset protégé.
- Distinguer clairement fait observé et inférence à partir d’une capture.

## Livrables et contrats

- `source-inventory.md`, `page-map.md`, `component-map.md`, `behavior-map.md`, `asset-map.md`, `reconstruction-spec.md`.

## Anti-patterns

- Inférer une logique backend depuis l’apparence seule.
- Utiliser une unique capture comme spécification responsive complète.
