---
name: threat-model
description: >-
  Modéliser les menaces d’un système ou changement. Utiliser lors d’une nouvelle architecture, intégration, frontière de confiance ou fonctionnalité sensible.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Modèle de menaces

## Méthode

1. Cartographier actifs, acteurs, flux, stockages, privilèges et frontières de confiance.
2. Identifier abus et menaces par composant, y compris logique métier et dépendances.
3. Évaluer impact, vraisemblance, contrôles existants et risques résiduels.
4. Assigner mitigations, tests et propriétaires; mettre à jour le modèle après changement majeur.

## Gates

- Chaque frontière de confiance doit avoir des contrôles explicites.
- Les menaces critiques sans mitigation bloquent l’architecture ou la release.

## Livrables et contrats

- Diagramme ou tableau de menaces, mitigations et tests de vérification.

## Anti-patterns

- Lister des vulnérabilités génériques sans flux concret.
- Oublier les utilisateurs légitimes abusant de leurs droits.
