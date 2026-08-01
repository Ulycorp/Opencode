---
name: eas-submit
description: >-
  Préparer et soumettre un build mobile aux stores. Utiliser uniquement après validation d’un artefact de production précis.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "mobile"
  version: "1.0.0"
---

# Soumission EAS

## Méthode

1. Identifier l’artefact validé, application, plateforme, version et canal de destination.
2. Vérifier metadata store, conformité, privacy, captures et credentials gérés hors dépôt.
3. Exécuter la soumission avec le profil prévu puis suivre son statut.
4. Enregistrer identifiant, résultat, messages store et actions de suivi.

## Gates

- La soumission exige une approbation de release explicite.
- Ne jamais reconstruire silencieusement un artefact différent de celui validé.

## Livrables et contrats

- Preuve de soumission, statut store et journal de suivi.

## Anti-patterns

- Soumettre un build preview.
- Ignorer un avertissement de conformité du store.
