---
name: mobile-navigation
description: >-
  Concevoir ou modifier navigation et deep links mobiles. Utiliser pour piles, onglets, modales, liens universels et restauration d’état.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "mobile"
  version: "1.0.0"
---

# Navigation mobile

## Méthode

1. Cartographier destinations, conditions d’accès, retours et transitions critiques.
2. Définir routes typées, paramètres minimaux et propriété des états.
3. Gérer authentification, deep links, notifications, restauration et destinations inconnues.
4. Tester retour système, gestes, rotation, interruption et liens à froid/à chaud.

## Gates

- Une route sensible doit revérifier l’autorisation, pas seulement la navigation.
- Les paramètres ne doivent pas transporter de secret ou objet métier complet.

## Livrables et contrats

- Carte de navigation, contrat de routes et tests de parcours.

## Anti-patterns

- Dupliquer un même écran dans plusieurs piles sans stratégie.
- Réinitialiser arbitrairement l’historique pour corriger un bug.
