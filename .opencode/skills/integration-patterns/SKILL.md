---
name: integration-patterns
description: >-
  Concevoir une intégration avec un service ou système externe. Utiliser pour API tierce, webhook, file, événement ou synchronisation.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Patterns d’intégration

## Méthode

1. Définir contrat, propriété des données, limites, disponibilité et modèle de confiance.
2. Choisir synchrone, asynchrone, polling ou événement selon latence et fiabilité.
3. Implémenter timeout, idempotence, retry borné, déduplication et circuit de dégradation.
4. Tracer corrélation et résultats; tester panne, retard, duplication et ordre inattendu.

## Gates

- Toute mutation externe doit être rejouable sans duplication dangereuse.
- Le fallback doit être visible et ne pas se présenter comme la source primaire.

## Livrables et contrats

- Contrat d’intégration, stratégie de résilience et tests de panne.

## Anti-patterns

- Supposer qu’un service distant est toujours disponible.
- Mélanger credentials, logique métier et client réseau.
