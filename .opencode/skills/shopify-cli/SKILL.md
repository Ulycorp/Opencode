---
name: shopify-cli
description: >-
  Utiliser Shopify CLI pour développement, validation et déploiement contrôlé. Utiliser pour thèmes, apps, preview et opérations locales autorisées.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shopify"
  version: "1.0.0"
---

# Shopify CLI

## Méthode

1. Vérifier boutique cible, compte, répertoire et état Git avant toute commande.
2. Choisir `theme dev`, `theme pull`, `theme check`, `theme push`, `app dev` ou `app deploy` selon l’objectif.
3. Préférer thème de développement ou unpublished et capturer l’identifiant/URL de preview.
4. Passer les gates avant toute commande de publication ou déploiement difficile à inverser.

## Gates

- `theme publish` exige une validation explicite et la cible exacte.
- Ne jamais pull/push de façon à écraser silencieusement des changements distants.

## Livrables et contrats

- Commande et cible traçables, preview ou artefact de déploiement vérifié.

## Anti-patterns

- Utiliser le thème live comme environnement de test.
- Supposer la boutique active à partir du seul nom local.
