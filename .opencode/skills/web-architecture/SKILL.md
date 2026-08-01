---
name: web-architecture
description: >-
  Concevoir ou réviser l’architecture d’une application Web. Utiliser avant une création, migration, découpe de modules ou changement transversal.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Architecture Web

## Méthode

1. Inventorier besoins, contraintes, code existant, dépendances et qualités attendues.
2. Définir frontières fonctionnelles, composants, flux, responsabilités et points de confiance.
3. Choisir les compromis de rendu, état, données, intégrations, déploiement et évolution.
4. Consigner vue d’ensemble, décisions, risques et plan d’implémentation dans `it/web/architecture/`.

## Gates

- Tout choix majeur doit être relié à un besoin ou une contrainte.
- Les contrats partagés doivent être stabilisés avant les implémentations parallèles.

## Livrables et contrats

- `overview.md`, décisions associées et carte des composants avec dépendances.

## Anti-patterns

- Choisir une pile par habitude sans analyser le projet.
- Créer des abstractions sans consommateur ni besoin démontré.
