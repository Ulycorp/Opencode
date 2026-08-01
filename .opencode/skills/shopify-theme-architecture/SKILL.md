---
name: shopify-theme-architecture
description: >-
  Structurer un thème Shopify maintenable. Utiliser lors d’une création, reconstruction ou refonte importante de thème.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shopify"
  version: "1.0.0"
---

# Architecture de thème Shopify

## Méthode

1. Cartographier templates JSON, sections, blocks, snippets, assets et settings.
2. Définir frontières entre primitives, composants éditoriaux et sections métier.
3. Concevoir schémas éditeur stables, presets et compatibilité des contenus existants.
4. Documenter conventions puis valider personnalisation, performance et upgrade.

## Gates

- Les marchands doivent pouvoir éditer sans casser la structure.
- Éviter les dépendances implicites entre sections éloignées.

## Livrables et contrats

- Carte du thème, conventions et structure prête à implémenter.

## Anti-patterns

- Créer une section unique pour toute la page.
- Coder en dur contenu, couleurs ou identifiants de boutique.
