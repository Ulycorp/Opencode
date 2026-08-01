---
name: android-native
description: >-
  Implémenter ou diagnostiquer une capacité native Android. Utiliser pour Kotlin/Java, Gradle, Manifest, SDK, signing ou build.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "mobile"
  version: "1.0.0"
---

# Développement natif Android

## Méthode

1. Inspecter versions Gradle/SDK, modules, variantes et dépendances avant modification.
2. Définir permission, composant plateforme et contrat avec la couche applicative.
3. Implémenter en respectant lifecycle, compatibilité et restrictions d’arrière-plan.
4. Construire et tester les variantes pertinentes sur émulateur/appareil puis vérifier le manifeste final.

## Gates

- Aucune permission dangereuse sans besoin, UX de refus et contrôle de minimisation.
- Les clés de signing restent hors dépôt et hors logs.

## Livrables et contrats

- Changement Android, manifeste/configuration et preuves de build/test.

## Anti-patterns

- Forcer une version SDK sans vérifier les dépendances.
- Tester uniquement sur une seule densité ou version récente.
