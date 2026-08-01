---
name: migration-safety
description: >-
  Évaluer et sécuriser une migration de données, schéma ou système. Utiliser avant tout changement difficile à inverser.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Sécurité des migrations

## Méthode

1. Inventorier producteurs, consommateurs, volumes, incompatibilités et fenêtres opérationnelles.
2. Choisir migration progressive, double lecture/écriture ou bascule selon le risque.
3. Définir invariants de contrôle, checkpoints, métriques et critères d’arrêt.
4. Répéter sur copie représentative puis exécuter avec rollback ou roll-forward documenté.

## Gates

- Aucune suppression finale avant validation de tous les consommateurs.
- Les opérations longues doivent être reprenables et observables.

## Livrables et contrats

- Plan de migration, runbook, critères de validation et restauration.

## Anti-patterns

- Faire une bascule irréversible sans répétition.
- Supposer que succès technique signifie cohérence métier.
