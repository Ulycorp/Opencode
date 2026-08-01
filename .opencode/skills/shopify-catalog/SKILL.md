---
name: shopify-catalog
description: >-
  Créer, importer ou auditer produits, variantes, collections, menus et données associées. Utiliser pour toute opération de catalogue.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shopify"
  version: "1.0.0"
---

# Catalogue Shopify

## Méthode

1. Définir source de vérité, identifiants, règles de variantes, prix, stocks et marchés.
2. Valider et normaliser les données avant toute mutation Shopify.
3. Exécuter import en lot borné et idempotent avec rapport d’erreurs.
4. Contrôler échantillons, décomptes, relations, storefront et possibilité de reprise.

## Gates

- Aucune mutation massive sans sauvegarde/export et dry-run.
- Ne pas écraser une donnée marchand plus récente sans règle de résolution.

## Livrables et contrats

- Mapping de catalogue, rapport d’import et contrôles de cohérence.

## Anti-patterns

- Identifier les produits uniquement par titre.
- Ignorer devises, taxes, marchés ou disponibilité.
