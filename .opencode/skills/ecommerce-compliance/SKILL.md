---
name: ecommerce-compliance
description: >-
  Auditer un parcours de vente en ligne, notamment Shopify. Utiliser avant lancement ou lors d’un changement d’offre, prix, paiement ou livraison.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "legal"
  version: "1.0.0"
---

# Conformité e-commerce

## Méthode

1. Identifier vendeur, clients visés, territoires, produits/services et parcours contractuel.
2. Vérifier informations précontractuelles, prix, commande, paiement, livraison, rétractation, remboursement et garanties.
3. Examiner CGV, facturation, cookies, données clients et preuves affichées dans le parcours.
4. Relier chaque constat à une source officielle et proposer remédiation sans modifier le code.

## Gates

- Tester ce que voit réellement le client, pas seulement les documents déclaratifs.
- Toute exception au droit de rétractation doit être justifiée précisément.

## Livrables et contrats

- Audit sous `legal/ecommerce/` ou `legal/audits/` avec priorités.

## Anti-patterns

- Utiliser une checklist générique sans produit ni territoire.
- Supposer que la plateforme rend automatiquement la boutique conforme.
