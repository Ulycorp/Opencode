---
name: testing-strategy
description: >-
  Concevoir une couverture de tests proportionnée au risque. Utiliser lors de la planification, de l’implémentation ou de la validation d’une fonctionnalité.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shared"
  version: "1.0.0"
---

# Stratégie de tests

## Méthode

1. Identifier les comportements critiques, frontières, erreurs, permissions et régressions probables.
2. Répartir les vérifications entre tests unitaires, intégration, contrat, E2E et contrôles non fonctionnels.
3. Définir données, environnements, oracles et critères de succès reproductibles.
4. Exécuter les tests pertinents, capturer les preuves et expliquer précisément les vérifications impossibles.

## Gates

- Couvrir au moins le chemin nominal, les erreurs critiques et les contrôles d’accès touchés.
- Éviter les tests qui valident uniquement l’implémentation interne.

## Livrables et contrats

- Une matrice de tests et des résultats reproductibles reliés aux critères d’acceptation.

## Anti-patterns

- Déclarer terminé parce que le code compile.
- Ignorer les tests instables ou les neutraliser sans diagnostic.
