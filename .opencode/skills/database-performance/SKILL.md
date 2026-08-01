---
name: database-performance
description: >-
  Diagnostiquer et améliorer les performances d’une base. Utiliser pour requêtes lentes, contention, croissance ou capacité.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Performance base de données

## Méthode

1. Capturer requête, plan, volume, fréquence, latence et charge dans un contexte reproductible.
2. Identifier sélectivité, scans, jointures, tris, verrous, N+1 et saturation.
3. Choisir la correction minimale: requête, index, modèle, cache ou charge.
4. Comparer avant/après et vérifier impact sur écritures, stockage et autres requêtes.

## Gates

- Un index doit être justifié par une charge réelle ou un risque mesurable.
- Une optimisation ne doit pas affaiblir les invariants ou la cohérence.

## Livrables et contrats

- Diagnostic avec preuves, changement mesuré et risques secondaires.

## Anti-patterns

- Ajouter des index à chaque colonne.
- Optimiser sur un jeu de données non représentatif.
