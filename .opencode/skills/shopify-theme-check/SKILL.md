---
name: shopify-theme-check
description: >-
  Valider statiquement un thème Shopify. Utiliser pendant le développement et comme gate obligatoire avant preview ou publication.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shopify"
  version: "1.0.0"
---

# Theme Check

## Méthode

1. Exécuter Theme Check depuis la racine correcte avec configuration du projet.
2. Classer erreurs, avertissements, faux positifs documentés et fichiers concernés.
3. Corriger les problèmes de syntaxe, performance, accessibilité et pratiques Liquid.
4. Relancer jusqu’à résultat acceptable puis conserver la commande et son statut.

## Gates

- Toute erreur bloquante empêche le push du thème.
- Une exclusion doit être minimale, justifiée et versionnée.

## Livrables et contrats

- Rapport Theme Check reproductible et corrections associées.

## Anti-patterns

- Désactiver une règle globalement pour un cas local.
- Confondre Theme Check réussi et QA fonctionnelle complète.
