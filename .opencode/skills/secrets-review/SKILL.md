---
name: secrets-review
description: >-
  Détecter et prévenir l’exposition de secrets. Utiliser avant commit, release, partage de logs ou après suspicion de fuite.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Revue de secrets

## Méthode

1. Inspecter diff, fichiers suivis, historique pertinent, configurations, artefacts et journaux.
2. Distinguer valeurs factices, identifiants publics et secrets actifs sans recopier ces derniers.
3. Si exposition confirmée, stopper la diffusion, révoquer/rotater et nettoyer par procédure approuvée.
4. Remplacer par référence d’environnement et ajouter un contrôle préventif.

## Gates

- Une valeur exposée est considérée compromise jusqu’à preuve contraire.
- Ne jamais imprimer le secret dans le rapport de revue.

## Livrables et contrats

- Verdict sans valeur sensible, liste d’emplacements et actions de rotation.

## Anti-patterns

- Se contenter de supprimer le fichier courant sans rotation.
- Mettre un secret réel dans `.env.example`.
