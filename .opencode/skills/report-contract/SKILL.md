---
name: report-contract
description: >-
  Produire ou valider un rapport Markdown `report.v1`. Utiliser pour toute étude, synthèse ou audit persistant.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shared"
  version: "1.0.0"
---

# Contrat de rapport

## Méthode

1. Renseigner le frontmatter requis: schéma, projet, agent, type, statut, dates et version du workspace si disponible.
2. Structurer le document avec résumé, objectif, méthodologie, observations, analyse, recommandations, limites et sources.
3. Relier chaque affirmation importante à une preuve et distinguer fait, source, inférence, estimation et inconnu.
4. Exécuter `report_validate` avant consolidation ou checkpoint Git.

## Gates

- Le projet, l’agent et le chemin doivent être cohérents.
- Un rapport externe sans sources ni date de vérification est invalide.

## Livrables et contrats

- Un Markdown conforme à `report.v1`, indexable et lisible hors conversation.

## Anti-patterns

- Mélanger observations et conclusions sans étiquette.
- Omettre les limites ou inventer une précision absente des sources.
