---
name: maestro-e2e
description: >-
  Automatiser des parcours mobiles natifs de bout en bout. Utiliser pour les scénarios critiques stables sur émulateur ou appareil.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "mobile"
  version: "1.0.0"
---

# E2E mobile avec Maestro

## Méthode

1. Choisir un parcours à forte valeur et préparer données/compte isolés.
2. Utiliser des sélecteurs stables et des assertions sur résultats utilisateur.
3. Gérer lancement propre, permissions, attente conditionnelle et nettoyage.
4. Exécuter sur plateformes ciblées, conserver artefacts d’échec et réduire la variance.

## Gates

- Le flow doit être indépendant de l’ordre d’autres tests.
- Aucun identifiant sensible ne doit être codé dans le scénario.

## Livrables et contrats

- Flows Maestro, résultats et captures/logs d’échec utiles.

## Anti-patterns

- Automatiser chaque détail d’animation.
- Compenser une instabilité avec des attentes fixes longues.
