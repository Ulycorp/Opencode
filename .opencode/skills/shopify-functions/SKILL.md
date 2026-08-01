---
name: shopify-functions
description: >-
  Concevoir ou modifier une Shopify Function. Utiliser pour logique serveur extensible prise en charge par la plateforme.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shopify"
  version: "1.0.0"
---

# Shopify Functions

## Méthode

1. Confirmer que le cas d’usage et le plan Shopify supportent la Function visée.
2. Définir input query minimal, configuration marchand et output déterministe.
3. Implémenter avec contraintes de runtime, taille et performance mesurées.
4. Tester scénarios nominaux, limites et absence de configuration avant déploiement de l’app.

## Gates

- La Function doit échouer de manière sûre et déterministe.
- Ne pas introduire une dépendance réseau indisponible dans le runtime.

## Livrables et contrats

- Function, configuration, tests et preuve de compatibilité plateforme.

## Anti-patterns

- Utiliser une Function pour contourner une limite contractuelle.
- Lire plus de données que nécessaire dans l’input.
