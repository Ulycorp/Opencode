---
name: shopify-accessibility
description: >-
  Concevoir ou auditer l’accessibilité d’un thème Shopify. Utiliser pour navigation, produit, panier, recherche et checkout accessible dans le périmètre modifiable.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shopify"
  version: "1.0.0"
---

# Accessibilité Shopify

## Méthode

1. Auditer structure, landmarks, titres, liens, formulaires et composants interactifs.
2. Tester clavier, focus, annonces panier, variantes, erreurs et contenu dynamique.
3. Vérifier contraste, zoom, images, prix, disponibilité et messages de validation.
4. Corriger dans les primitives partagées puis retester les parcours commerce.

## Gates

- Achat, recherche et navigation doivent rester utilisables au clavier.
- Les changements ne doivent pas prétendre modifier le checkout hors capacité du plan.

## Livrables et contrats

- Constats, correctifs et preuves sur parcours produit-panier.

## Anti-patterns

- Tester uniquement la page d’accueil.
- Masquer une information produit importante aux technologies d’assistance.
