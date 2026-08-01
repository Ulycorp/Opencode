---
name: task-delegation
description: >-
  Créer et contrôler des sous-tâches inter-agents sûres. Utiliser dès qu’un agent confie un livrable précis à un autre agent.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shared"
  version: "1.0.0"
---

# Délégation de tâches

## Méthode

1. Construire le contrat avec `task_id`, `project_id`, `requested_by`, `objective`, `expected_output`, `output_path`, `delegation_depth`, `visited_agents` et `deadline_policy`.
2. Refuser l’appel si l’agent cible figure déjà dans `visited_agents` ou si la profondeur dépasserait quatre.
3. Donner au spécialiste le contexte minimal, les contraintes, les sources autorisées et le critère de fin.
4. Valider le livrable au retour; l’orchestrateur consolide les fichiers partagés et reprend le contrôle en cas d’échec.

## Gates

- Toute délégation doit produire un livrable défini.
- Les tâches indépendantes doivent être lancées en parallèle lorsque les chemins de sortie ne se chevauchent pas.

## Livrables et contrats

- Un contrat de sous-tâche validable et un résultat rattaché à son agent producteur.

## Anti-patterns

- Déléguer pour demander « que dois-je faire ? ».
- Créer une boucle de délégation ou deux écrivains sur le même fichier.
