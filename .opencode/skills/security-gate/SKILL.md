---
name: security-gate
description: >-
  Décider si un changement peut franchir une étape de livraison du point de vue sécurité. Utiliser avant merge, preview sensible, déploiement ou publication.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shared"
  version: "1.0.0"
---

# Gate de sécurité

## Méthode

1. Définir les actifs, surfaces exposées, changements de confiance et exigences applicables.
2. Vérifier secrets, dépendances, authentification, autorisation, validation, stockage et journalisation.
3. Classer chaque constat par impact, probabilité, preuve et remédiation.
4. Bloquer les risques critiques ou élevés non acceptés; consigner les risques résiduels.

## Gates

- Aucun secret ou accès non autorisé ne peut être accepté silencieusement.
- Toute exception doit avoir un propriétaire, une échéance et une justification.

## Livrables et contrats

- Un verdict pass, pass-with-risk ou fail avec preuves et actions.

## Anti-patterns

- Se limiter à un scanner automatique.
- Confondre absence d’alerte et absence de risque.
