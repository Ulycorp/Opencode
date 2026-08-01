---
name: mobile-offline
description: >-
  Concevoir cache, synchronisation et expérience hors ligne. Utiliser lorsqu’une application doit fonctionner avec réseau absent ou instable.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "mobile"
  version: "1.0.0"
---

# Mode hors ligne mobile

## Méthode

1. Classifier données en locales, mises en cache, synchronisées et strictement serveur.
2. Définir source de vérité, mutations en attente, identifiants, ordre et conflits.
3. Implémenter file persistante, retry borné, déduplication et indication d’état utilisateur.
4. Tester coupure, reprise, duplication, données obsolètes, changement de compte et manque de stockage.

## Gates

- Une mutation rejouée doit être idempotente ou dédupliquée.
- Les tokens et données sensibles doivent utiliser un stockage adapté.

## Livrables et contrats

- Stratégie offline/sync, modèle de conflits et scénarios de test.

## Anti-patterns

- Présenter une donnée en cache comme fraîche sans indicateur.
- Écraser automatiquement un conflit métier non résoluble.
