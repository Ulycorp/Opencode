---
name: shopify-liquid
description: >-
  Implémenter ou corriger templates, snippets et rendu Liquid Shopify. Utiliser pour logique de présentation côté thème.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shopify"
  version: "1.0.0"
---

# Liquid Shopify

## Méthode

1. Identifier objet Shopify, contexte de template et données réellement disponibles.
2. Préparer les données avant le markup et limiter boucles, requêtes et branches imbriquées.
3. Échapper ou filtrer le contenu selon son contexte et fournir des états vides robustes.
4. Exécuter Theme Check puis valider rendu avec données représentatives.

## Gates

- Aucune logique sensible ou secret dans Liquid.
- Respecter les limites de plateforme et éviter les opérations coûteuses dans les boucles.

## Livrables et contrats

- Templates/snippets lisibles, conformes à Theme Check et testés en preview.

## Anti-patterns

- Reproduire un moteur applicatif dans Liquid.
- Supposer qu’un produit possède toujours image, variante ou prix normal.
