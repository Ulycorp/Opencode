---
name: backend-engineering
description: >-
  Implémenter services, logique métier, jobs et intégrations côté serveur. Utiliser pour tout changement backend.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Ingénierie backend

## Méthode

1. Lire contrat, modèle de domaine, exigences d’autorisation et conventions d’observabilité.
2. Séparer transport, application, domaine et accès aux ressources selon la complexité réelle.
3. Valider les entrées, appliquer invariants et rendre erreurs/idempotence explicites.
4. Tester chemins nominaux, échecs, concurrence et effets externes avant intégration.

## Gates

- Toute entrée externe est non fiable et toute action sensible est autorisée côté serveur.
- Les effets partiels doivent être évités ou compensables.

## Livrables et contrats

- Code backend, tests, contrats mis à jour et notes d’exploitation.

## Anti-patterns

- Placer la logique métier uniquement dans routes ou ORM.
- Avaler une erreur pour retourner un succès apparent.
