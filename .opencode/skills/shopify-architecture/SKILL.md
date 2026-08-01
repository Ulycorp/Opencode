---
name: shopify-architecture
description: >-
  Concevoir la solution Shopify adaptée à un besoin commerce. Utiliser avant thème, catalogue, extension, Function ou intégration.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shopify"
  version: "1.0.0"
---

# Architecture Shopify

## Méthode

1. Analyser expérience cible, boutique, catalogue, marchés, opérations et contraintes légales.
2. Décider ce qui relève du thème, données Shopify, configuration, app, extension ou service externe.
3. Définir modèles de contenu, metafields/metaobjects, intégrations, performances et sécurité.
4. Planifier développement local, thème unpublished, QA, preview, migration et gate de publication.

## Gates

- Éviter une app custom lorsqu’une capacité native répond durablement au besoin.
- Toute dépendance au live doit être précédée d’un environnement de preview.

## Livrables et contrats

- Architecture dans `it/shopify/architecture/` et décisions de découpage.

## Anti-patterns

- Mettre la logique métier complexe dans Liquid.
- Choisir une extension sans analyser maintenance et permissions.
