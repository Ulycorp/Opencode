---
name: eas-build
description: >-
  Configurer et produire des builds Expo reproductibles. Utiliser pour profils development, preview ou production.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "mobile"
  version: "1.0.0"
---

# Build EAS

## Méthode

1. Vérifier configuration Expo, identifiants applicatifs, versions et dépendances natives.
2. Définir profils de build avec variables non sensibles référencées hors dépôt.
3. Lancer la plateforme demandée et suivre la construction jusqu’à l’artefact.
4. Installer ou inspecter l’artefact, exécuter smoke tests et enregistrer version/profil.

## Gates

- Un build production nécessite les quality gates et la configuration release.
- Les credentials de signature ne doivent jamais être copiés dans les fichiers ou logs.

## Livrables et contrats

- Artefact identifié par plateforme/profil et preuve de smoke test.

## Anti-patterns

- Utiliser le profil production pour une simple validation locale.
- Confondre fin du build distant et validation de l’application.
