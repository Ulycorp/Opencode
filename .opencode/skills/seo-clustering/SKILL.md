---
name: seo-clustering
description: >-
  Regrouper des requêtes en ensembles exploitables pour l’architecture de contenu. Utiliser après une recherche de mots-clés.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "market"
  version: "1.0.0"
---

# Clustering SEO

## Méthode

1. Nettoyer les requêtes et conserver intention, langue, marché et métriques.
2. Regrouper selon similarité d’intention et chevauchement probable des résultats, pas seulement les mots communs.
3. Nommer chaque cluster, choisir sujet principal et sous-questions.
4. Mapper clusters vers pages existantes, nouvelles pages ou contenus de soutien.

## Gates

- Deux intentions incompatibles ne partagent pas une page pour commodité.
- Éviter la cannibalisation en définissant un propriétaire par intention principale.

## Livrables et contrats

- Carte clusters-pages avec priorité et justification.

## Anti-patterns

- Créer un cluster par mot.
- Utiliser uniquement une distance lexicale.
