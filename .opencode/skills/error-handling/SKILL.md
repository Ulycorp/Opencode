---
name: error-handling
description: >-
  Définir des erreurs utiles, sûres et observables. Utiliser pour API, UI, jobs et intégrations susceptibles d’échouer.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Gestion des erreurs

## Méthode

1. Classifier erreurs attendues, validation, conflit, indisponibilité et défaut interne.
2. Définir un contrat stable avec code, message public, contexte interne et possibilité de retry.
3. Préserver la cause dans l’observabilité sans exposer données sensibles.
4. Tester propagation, compensation, retry borné et expérience utilisateur.

## Gates

- Une erreur ne doit jamais être transformée silencieusement en succès.
- Les messages publics ne révèlent ni secret ni détail exploitable.

## Livrables et contrats

- Taxonomie et contrat d’erreurs, instrumentation et scénarios de test.

## Anti-patterns

- Retourner une exception brute au client.
- Retry sans limite ni idempotence.
