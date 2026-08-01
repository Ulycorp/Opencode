---
name: shopify-sections
description: >-
  Créer des sections et blocks configurables dans l’éditeur de thème. Utiliser pour tout module de page pilotable par le marchand.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shopify"
  version: "1.0.0"
---

# Sections Shopify

## Méthode

1. Définir objectif, contenu variable, limites et comportement responsive.
2. Concevoir schema, settings, blocks, presets et valeurs par défaut utiles.
3. Implémenter markup sémantique, styles isolés et comportement sans JavaScript lorsque possible.
4. Tester ajout, suppression, réordonnancement, contenu extrême et événements de l’éditeur.

## Gates

- Respecter limites de settings/blocks et stabilité des IDs.
- Une section vide doit rester sûre et compréhensible.

## Livrables et contrats

- Section configurable, preset et scénarios d’éditeur validés.

## Anti-patterns

- Ajouter un setting pour chaque détail visuel sans système.
- Dépendre d’un ordre fixe de blocks non documenté.
