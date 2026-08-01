---
name: mobile-architecture
description: >-
  Concevoir ou réviser l’architecture d’une application mobile. Utiliser avant création, migration ou changement touchant navigation, natif, données ou release.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "mobile"
  version: "1.0.0"
---

# Architecture mobile

## Méthode

1. Identifier plateformes, appareils, contraintes produit, capacités natives et stratégie de distribution.
2. Définir navigation, état, frontière JS/natif, API, stockage, offline, notifications et deep links.
3. Documenter permissions, sécurité, observabilité, tests et compatibilité des versions.
4. Découper le travail entre UI, sync, spécialistes natifs, QA, sécurité et release.

## Gates

- Chaque capacité native doit avoir comportement de refus et fallback défini.
- Le contrat API partagé doit précéder les implémentations Web/mobile parallèles.

## Livrables et contrats

- Architecture dans `it/mobile/architecture/`, décisions et plan de livraison.

## Anti-patterns

- Copier une architecture Web sans contraintes mobile.
- Ajouter du natif lorsque la capacité plateforme existante suffit.
