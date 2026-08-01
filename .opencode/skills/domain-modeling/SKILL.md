---
name: domain-modeling
description: >-
  Modéliser concepts, règles et frontières métier. Utiliser lorsqu’une fonctionnalité implique des invariants, états ou vocabulaires partagés.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Modélisation de domaine

## Méthode

1. Extraire le vocabulaire métier des besoins et distinguer entités, valeurs, événements et acteurs.
2. Définir invariants, transitions, responsabilités et frontières de contexte.
3. Tester le modèle sur les scénarios nominaux, limites et conflits connus.
4. Aligner API, données et code sur le modèle; enregistrer les décisions structurantes.

## Gates

- Chaque invariant doit avoir un propriétaire d’application et un test.
- Éviter qu’un même terme possède plusieurs sens non documentés.

## Livrables et contrats

- Glossaire, modèle de domaine, transitions et règles vérifiables.

## Anti-patterns

- Copier directement la structure d’écran dans le domaine.
- Mettre toute la logique métier dans contrôleurs ou composants UI.
