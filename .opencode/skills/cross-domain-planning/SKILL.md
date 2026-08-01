---
name: cross-domain-planning
description: >-
  Planifier un workflow impliquant plusieurs domaines ou orchestrateurs. Utiliser pour les demandes combinant produit, marché, marketing, Web, mobile, Shopify ou juridique.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shared"
  version: "1.0.0"
---

# Planification transverse

## Méthode

1. Décomposer l’objectif en résultats indépendants, dépendances et points de synchronisation.
2. Attribuer chaque résultat à son propriétaire fonctionnel et définir les chemins d’artefacts.
3. Paralléliser les branches sans dépendance et réserver les consolidations aux orchestrateurs.
4. Placer les audits, quality gates, validations humaines et checkpoints Git aux frontières appropriées.

## Gates

- Aucune branche ne démarre sans inputs disponibles ou hypothèses déclarées.
- Aucune action destructive ou publication n’est implicite dans le plan.

## Livrables et contrats

- Un graphe de travail ordonné avec propriétaires, dépendances, gates et critères de terminaison.

## Anti-patterns

- Séquencer toutes les tâches par confort.
- Confondre orchestration, expertise et exécution déterministe.
