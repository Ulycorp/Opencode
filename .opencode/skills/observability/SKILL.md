---
name: observability
description: >-
  Instrumenter ou auditer la visibilité d’un système en fonctionnement. Utiliser pour logs, métriques, traces, alertes et diagnostic de production.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Observabilité applicative

## Méthode

1. Définir les questions opérationnelles et objectifs de service avant de choisir les signaux.
2. Ajouter logs structurés, métriques et traces aux frontières et opérations critiques.
3. Propager un identifiant de corrélation et filtrer secrets ou données personnelles.
4. Construire alertes actionnables et vérifier le diagnostic sur des pannes simulées.

## Gates

- Chaque alerte doit avoir un propriétaire et une action possible.
- La télémétrie ne doit pas exposer de donnée sensible ni devenir un journal métier exhaustif.

## Livrables et contrats

- Plan d’instrumentation, tableaux/alertes attendus et preuve de diagnostic.

## Anti-patterns

- Logger tout sans structure ni rétention.
- Mesurer uniquement l’état des machines et pas le résultat utilisateur.
