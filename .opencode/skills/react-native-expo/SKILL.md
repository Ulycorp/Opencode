---
name: react-native-expo
description: >-
  Construire ou maintenir une application React Native/Expo. Utiliser lorsque le projet emploie Expo ou un runtime React Native compatible.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "mobile"
  version: "1.0.0"
---

# React Native et Expo

## Méthode

1. Détecter versions, workflow géré/prébuild, configuration et modules natifs existants.
2. Implémenter composants, navigation et accès plateforme avec APIs compatibles au projet.
3. Configurer permissions, deep links, assets, variables publiques et profils d’environnement.
4. Exécuter tests, vérification de configuration et build de preview représentatif.

## Gates

- Toute dépendance native doit être compatible avec le workflow et les plateformes ciblées.
- Aucun secret ne doit être intégré au bundle mobile.

## Livrables et contrats

- Code React Native, configuration Expo et preuve de build preview.

## Anti-patterns

- Lancer un prébuild ou éjecter sans besoin validé.
- Supposer qu’un comportement identique existe sur iOS et Android.
