---
name: mobile-release
description: >-
  Orchestrer une release mobile de la preview à la distribution. Utiliser avant publication interne ou store.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "mobile"
  version: "1.0.0"
---

# Release mobile

## Méthode

1. Figer scope, version, changelog, plateformes, configuration et artefacts.
2. Rassembler tests, sécurité MASVS, navigation, permissions et builds requis.
3. Distribuer une preview, obtenir validation puis produire l’artefact de production.
4. Soumettre avec gate, surveiller crashs/adoption et conserver stratégie de rollback/update.

## Gates

- Le build iOS est requis quand possible; toute impossibilité doit être explicite.
- Une publication store ou update critique nécessite une approbation définie.

## Livrables et contrats

- Dossier de release, artefacts, validations et statut de distribution.

## Anti-patterns

- Déclarer release terminée au seul succès de compilation.
- Changer configuration entre preview validée et production sans nouveau contrôle.
