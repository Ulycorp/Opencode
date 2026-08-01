---
name: legifrance-research
description: >-
  Trouver et vérifier textes ou jurisprudence via les sources officielles Légifrance. Utiliser pour lois, codes, règlements et décisions françaises.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "legal"
  version: "1.0.0"
---

# Recherche Légifrance

## Méthode

1. Formuler termes juridiques, code ou article, période et statut recherchés.
2. Chercher via les tools `frlegal_*` appropriés et récupérer le document complet pertinent.
3. Contrôler version en vigueur, dates, modifications, champ et renvois utiles.
4. Enregistrer identifiant, titre, statut, URL, extrait nécessaire et date de récupération.

## Gates

- Ne jamais citer un article abrogé comme droit actuel.
- Conserver le contexte nécessaire sans reproduire excessivement le texte.

## Livrables et contrats

- Références Légifrance normalisées utilisables dans un audit sourcé.

## Anti-patterns

- Citer uniquement un résultat de recherche.
- Déduire la validité d’un texte à partir de son titre.
