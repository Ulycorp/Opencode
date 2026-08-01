---
name: shopify-admin-api
description: >-
  Concevoir ou implémenter une intégration avec l’Admin API Shopify. Utiliser pour opérations administratives sur catalogue, commandes, clients ou configuration autorisée.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shopify"
  version: "1.0.0"
---

# Shopify Admin API

## Méthode

1. Définir ressource, boutique, portée, volume, fréquence et permissions minimales.
2. Vérifier version d’API et contrat via documentation adaptée au contexte.
3. Implémenter pagination, limites, idempotence, erreurs et reprise sans exposer credentials.
4. Tester sur boutique de développement avec données non sensibles et journaliser les mutations.

## Gates

- Aucun scope d’accès non nécessaire.
- Toute mutation en masse exige dry-run, bornage et stratégie de récupération.

## Livrables et contrats

- Contrat d’intégration, permissions requises et tests de comportement.

## Anti-patterns

- Coder une version d’API implicite.
- Utiliser des données clients réelles pour un test de développement.
