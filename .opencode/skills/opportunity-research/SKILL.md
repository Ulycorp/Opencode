---
name: opportunity-research
description: >-
  Rechercher subventions, programmes, événements, partenariats ou autres opportunités à la demande. Ne pas utiliser automatiquement pendant `/projet`.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "market"
  version: "1.0.0"
---

# Recherche d’opportunités

## Méthode

1. Lire `project.yaml`, `CONTEXT.md`, la synthèse et les rapports disponibles.
2. Définir catégorie, territoire, éligibilité, calendrier et valeur attendue.
3. Chercher d’abord les pages officielles et revérifier conditions et échéances au moment de l’étude.
4. Scorer adéquation, effort, incertitude et actions, puis classer dans le sous-dossier approprié.

## Gates

- Toujours vérifier la date limite sur une source officielle actuelle.
- Marquer fermé, incertain ou inconnu au lieu de supposer l’éligibilité.

## Livrables et contrats

- `opportunities/<category>/<date>-<topic>.md` avec organisme, URL, critères, score et actions.

## Anti-patterns

- Déclencher ce travail dans l’étude initiale `/projet`.
- Recopier un agrégateur sans vérifier l’annonce primaire.
