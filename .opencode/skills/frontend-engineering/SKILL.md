---
name: frontend-engineering
description: >-
  Implémenter des interfaces Web maintenables et testables. Utiliser pour composants, pages, formulaires, état client et intégrations API.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Ingénierie frontend

## Méthode

1. Lire design, critères d’acceptation, contrats API et conventions du dépôt.
2. Découper l’interface en composants avec responsabilités, états et accessibilité explicites.
3. Implémenter comportement, erreurs, chargement, responsive et télémétrie utile.
4. Vérifier lint, types, tests, parcours critiques et rendu visuel avant livraison.

## Gates

- Tous les états utilisateur importants doivent être traités.
- Les données non fiables doivent être échappées et validées aux frontières.

## Livrables et contrats

- Code frontend, tests associés et note des choix ou limites.

## Anti-patterns

- Concentrer récupération, logique métier et rendu dans un composant monolithique.
- Sacrifier clavier ou sémantique pour reproduire uniquement l’apparence.
