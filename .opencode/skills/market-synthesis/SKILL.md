---
name: market-synthesis
description: >-
  Consolider plusieurs études marché sans les répéter. Utiliser lorsque SEO, e-commerce et publicité sont terminés.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "market"
  version: "1.0.0"
---

# Synthèse de marché

## Méthode

1. Valider les rapports sources, dates, project ID, couverture et limites.
2. Extraire faits convergents, désaccords, risques, opportunités et questions ouvertes.
3. Hiérarchiser les recommandations selon preuve, impact, effort et réversibilité.
4. Relier chaque conclusion aux rapports d’origine et mettre à jour l’état du projet.

## Gates

- Attendre tous les livrables requis ou déclarer explicitement l’absence.
- Ne pas transformer trois inférences concordantes en fait.

## Livrables et contrats

- `market-research/synthesis.md` conforme à `report.v1`.

## Anti-patterns

- Concaténer les résumés des spécialistes.
- Masquer les désaccords pour produire un récit plus simple.
