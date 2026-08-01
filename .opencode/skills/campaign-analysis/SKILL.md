---
name: campaign-analysis
description: >-
  Évaluer une campagne marketing et décider des prochaines actions. Utiliser lorsque des données de diffusion, conversion ou création sont disponibles.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "marketing"
  version: "1.0.0"
---

# Analyse de campagne

## Méthode

1. Valider période, attribution, définitions de métriques, dépenses et intégrité des données.
2. Segmenter par audience, placement, créa, offre, destination et phase d’apprentissage.
3. Distinguer observation, causalité plausible, saisonnalité et inconnues.
4. Recommander arrêter, maintenir, amplifier ou tester avec seuils et risques.

## Gates

- Ne pas attribuer causalité à une simple corrélation.
- Signaler toute métrique absente, estimée ou non comparable.

## Livrables et contrats

- Rapport de campagne avec décisions, preuves et backlog d’expériences.

## Anti-patterns

- Optimiser une métrique intermédiaire au détriment du résultat métier.
- Comparer des fenêtres ou modèles d’attribution incompatibles.
