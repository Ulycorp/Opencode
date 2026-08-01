---
name: release-gate
description: >-
  Autoriser ou bloquer une mise en production après vérification complète. Utiliser avant toute publication, soumission store ou activation live.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shared"
  version: "1.0.0"
---

# Gate de release

## Méthode

1. Vérifier artefact, version, notes, configuration, migrations, secrets et compatibilité.
2. Rassembler les résultats qualité, sécurité, performance et conformité applicables.
3. Tester le chemin de déploiement, le monitoring et le rollback sur un environnement non live.
4. Exiger l’approbation prévue puis enregistrer décision, auteur, date et artefact publié.

## Gates

- Aucune publication live ne découle implicitement d’un build réussi.
- Un rollback non défini bloque les changements difficiles à inverser.

## Livrables et contrats

- Une décision de release traçable et un plan d’exécution ou de correction.

## Anti-patterns

- Contourner un gate parce que la modification paraît petite.
- Publier un artefact différent de celui testé.
