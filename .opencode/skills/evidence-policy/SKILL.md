---
name: evidence-policy
description: >-
  Collecter et rattacher des preuves aux affirmations. Utiliser pour les recherches externes, audits, comparaisons et décisions sensibles.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shared"
  version: "1.0.0"
---

# Politique de preuves

## Méthode

1. Définir les affirmations à soutenir avant de chercher des sources.
2. Privilégier source officielle, source primaire, documentation éditeur, étude reconnue, média puis communauté.
3. Enregistrer URL, titre, fournisseur, date, agent et claim avec `evidence_register`.
4. Signaler contradictions, fraîcheur, couverture et niveau de confiance dans le rapport.

## Gates

- Une source doit soutenir directement l’affirmation associée.
- Revérifier les échéances, lois et données volatiles au moment du travail.

## Livrables et contrats

- Un registre de preuves dédupliqué et des citations traçables.

## Anti-patterns

- Citer une page de résultats à la place de la source.
- Transformer une inférence en fait observé.
