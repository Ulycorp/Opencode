---
name: api-contracts
description: >-
  Définir et faire évoluer un contrat entre clients et services. Utiliser avant toute implémentation parallèle ou modification d’interface publique.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Contrats API

## Méthode

1. Recenser consommateurs, cas d’usage, données, erreurs, permissions et contraintes de compatibilité.
2. Spécifier opérations, schémas, validation, statuts, pagination, idempotence et versionnement.
3. Fournir exemples nominaux et d’échec sans inclure de secret ou donnée réelle sensible.
4. Faire valider le contrat par producteurs et consommateurs puis contrôler sa conformité par test.

## Gates

- Une rupture doit être versionnée ou accompagnée d’une migration explicite.
- Les règles d’autorisation ne doivent pas être implicites dans l’interface.

## Livrables et contrats

- `api-contract.md` ou spécification équivalente, schémas et tests de contrat.

## Anti-patterns

- Laisser le code du premier consommateur définir seul l’API.
- Retourner des erreurs indifférenciées ou des champs non documentés.
