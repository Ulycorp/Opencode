---
name: project-context
description: >-
  Charger et actualiser le contexte minimal d’un projet durable. Utiliser avant toute opération structurante, recherche, audit, planification ou livraison.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shared"
  version: "1.0.0"
---

# Contexte projet

## Méthode

1. Résoudre le projet canonique et lire d’abord `project.yaml`.
2. Lire ensuite `CONTEXT.md`, `STATUS.md`, la synthèse concernée puis les documents spécialisés nécessaires.
3. Contrôler la fraîcheur, la provenance et la cohérence des informations avant de les réutiliser.
4. Documenter toute information durable dans le fichier propriétaire au lieu de la laisser seulement dans la conversation.

## Gates

- Ne jamais relancer une étude coûteuse si un résultat suffisamment récent existe.
- Ne pas transformer `CONTEXT.md` en journal d’exécution.

## Livrables et contrats

- Un paquet de contexte minimal avec chemins, dates, statut et lacunes identifiées.

## Anti-patterns

- Lire tous les rapports ou tout le code par défaut.
- Prendre une donnée externe ancienne pour l’état actuel du projet.
