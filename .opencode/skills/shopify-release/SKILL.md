---
name: shopify-release
description: >-
  Orchestrer la mise à disposition sûre d’un thème ou d’une app Shopify. Utiliser après développement et avant publication live.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shopify"
  version: "1.0.0"
---

# Release Shopify

## Méthode

1. Identifier boutique, thème/app, commit, artefact et contenu exacts.
2. Exécuter Theme Check, tests, responsive, catalogue, performance, accessibilité et sécurité.
3. Pousser vers développement/unpublished, fournir preview et obtenir validation.
4. Publier uniquement après gate explicite, puis vérifier storefront et conserver rollback.

## Gates

- Aucun push live ou `theme publish` sans approbation.
- La cible Shopify doit être confirmée par identifiant, pas seulement par nom.

## Livrables et contrats

- Preview validée, décision de publication et journal de release.

## Anti-patterns

- Écraser le thème live directement.
- Publier un thème différent de celui présenté en preview.
