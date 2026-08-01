---
name: api-design
description: >-
  Concevoir une API cohérente, sûre et évolutive. Utiliser pour nouveaux endpoints, événements, commandes ou refontes d’interface.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Conception d’API

## Méthode

1. Partir des capacités métier et des consommateurs plutôt que des tables.
2. Définir ressources/opérations, schémas, erreurs, auth, pagination et limites.
3. Prévoir idempotence, concurrence, compatibilité et observabilité.
4. Valider avec exemples, revue consommateur et tests de contrat.

## Gates

- Chaque opération sensible doit préciser authentification et autorisation.
- Une incompatibilité doit avoir une politique de version ou migration.

## Livrables et contrats

- Spécification d’API et décisions associées prêtes à implémenter.

## Anti-patterns

- Exposer directement le modèle de persistance.
- Créer des comportements différents pour la même convention sans raison.
