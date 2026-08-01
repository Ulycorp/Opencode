---
name: secret-handling
description: >-
  Manipuler identifiants et valeurs sensibles sans exposition. Utiliser dès qu’une tâche touche authentification, variables d’environnement, CI, MCP ou déploiement.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shared"
  version: "1.0.0"
---

# Gestion des secrets

## Méthode

1. Identifier les secrets requis et leur propriétaire sans afficher leur valeur.
2. Utiliser environnement, secret manager, OAuth géré ou secrets CI; documenter seulement les noms de variables.
3. Vérifier fichiers suivis, logs, rapports, prompts et diffs avant commit.
4. Révoquer ou escalader immédiatement toute valeur exposée et consigner l’incident sans recopier le secret.

## Gates

- Aucun secret dans Git, Markdown, metadata créative ou journal d’exécution.
- Un `.env.example` ne contient que des clés et valeurs factices non sensibles.

## Livrables et contrats

- Une configuration de références de secrets et une vérification d’absence d’exposition.

## Anti-patterns

- Demander à l’utilisateur de coller un secret dans un document.
- Masquer partiellement une valeur puis la conserver dans les logs.
