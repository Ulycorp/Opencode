---
name: git-workflow
description: >-
  Versionner et synchroniser des livrables sans écraser le travail existant. Utiliser pour tout checkpoint, branche, commit, rebase sûr ou push.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shared"
  version: "1.0.0"
---

# Workflow Git

## Méthode

1. Inspecter `status`, `diff`, branche et remote avant toute écriture.
2. Sélectionner uniquement les fichiers du scope et vérifier l’absence de secret.
3. Créer un commit conforme à la convention et enregistrer son identifiant dans le log du workflow.
4. Avant push, fetcher, vérifier la divergence, rebaser seulement si sûr et escalader tout conflit non trivial.

## Gates

- Refuser force-push, reset destructif, nettoyage massif et push direct sur branche protégée.
- Ne jamais inclure un changement utilisateur hors scope dans le commit.

## Livrables et contrats

- Un checkpoint atomique, traçable et synchronisé sans perte de données.

## Anti-patterns

- Utiliser Git pour masquer ou écraser un état de travail.
- Pousser sans contrôler la divergence distante.
