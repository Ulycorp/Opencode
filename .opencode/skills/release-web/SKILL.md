---
name: release-web
description: >-
  Préparer et exécuter une release Web sûre. Utiliser après passage des gates et avant déploiement d’un artefact Web.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Release Web

## Méthode

1. Identifier commit, artefact, environnement, configuration et migrations exacts.
2. Vérifier résultats qualité/sécurité, compatibilité, secrets et notes de release.
3. Déployer d’abord sur environnement prévu, exécuter smoke tests et observer les signaux.
4. Promouvoir avec approbation requise, surveiller puis appliquer rollback si seuil dépassé.

## Gates

- L’artefact promu doit être celui qui a été testé.
- Les migrations ou changements irréversibles exigent une stratégie de récupération.

## Livrables et contrats

- Runbook, version publiée, preuves de smoke test et état post-release.

## Anti-patterns

- Reconstruire un artefact différent au moment de promouvoir.
- Déployer sans monitoring ni propriétaire de rollback.
