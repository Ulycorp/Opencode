---
name: workspace-routing
description: >-
  Router une demande vers le projet, le domaine, l’orchestrateur et le spécialiste appropriés. Utiliser pour toute entrée ambiguë, multi-domaine ou exprimée en langage naturel.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shared"
  version: "1.0.0"
---

# Workspace routing

## Méthode

1. Résoudre le projet depuis le nom, le slug ou le contexte courant; demander une précision seulement si plusieurs projets restent plausibles.
2. Lire `project.yaml`, `CONTEXT.md`, `STATUS.md` et uniquement la synthèse utile.
3. Classer la demande entre IT, business, juridique ou workflow transversal, puis choisir le propriétaire du résultat.
4. Déléguer avec un objectif, un chemin de sortie et un critère de fin explicites; agréger sans refaire le travail spécialisé.

## Gates

- Vérifier que l’agent choisi possède le scope d’écriture requis.
- Limiter le contexte et les MCP aux besoins réels de la sous-tâche.

## Livrables et contrats

- Une décision de routage traçable et une ou plusieurs sous-tâches conformes au contrat de délégation.

## Anti-patterns

- Charger tout le dépôt ou tous les MCP dans l’orchestrateur global.
- Exécuter soi-même une expertise lorsqu’un spécialiste dédié existe.
