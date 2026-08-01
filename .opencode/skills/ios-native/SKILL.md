---
name: ios-native
description: >-
  Implémenter ou diagnostiquer une capacité native iOS. Utiliser pour Swift, entitlements, signing, capabilities, build ou intégration plateforme.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "mobile"
  version: "1.0.0"
---

# Développement natif iOS

## Méthode

1. Vérifier disponibilité de Xcode, version du projet, target, SDK et dépendances.
2. Définir capability, entitlement, permission et contrat avec la couche applicative.
3. Implémenter le changement minimal puis tester sur simulateur et appareil lorsque requis.
4. Valider build, signing, privacy manifest et comportement sur versions supportées.

## Gates

- Ne pas prétendre valider iOS si l’environnement hôte ne permet pas le build.
- Toute permission doit être justifiée et accompagnée d’un usage compréhensible.

## Livrables et contrats

- Changement natif iOS, configuration et résultats de build/test.

## Anti-patterns

- Modifier signing ou identifiants de bundle sans scope explicite.
- Masquer un défaut natif derrière un fallback silencieux.
