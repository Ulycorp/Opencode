---
name: mobile-testing
description: >-
  Définir et exécuter les tests d’une application mobile. Utiliser pour logique, UI, intégrations plateforme et régressions multi-appareils.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "mobile"
  version: "1.0.0"
---

# Tests mobiles

## Méthode

1. Identifier parcours, états réseau, permissions, interruptions et plateformes critiques.
2. Répartir tests entre unité, intégration, composant, E2E et vérification appareil.
3. Stabiliser données, horloge, backend et configuration de build.
4. Exécuter la matrice minimale puis documenter plateformes réellement validées.

## Gates

- Ne pas revendiquer une plateforme non construite ou non exécutée.
- Couvrir refus de permission, reprise après interruption et réseau dégradé.

## Livrables et contrats

- Matrice plateformes/scénarios et résultats reproductibles.

## Anti-patterns

- Tester uniquement l’émulateur du développeur.
- Ignorer les transitions arrière-plan/premier plan.
