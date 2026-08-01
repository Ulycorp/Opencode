---
name: design-system
description: >-
  Créer, étendre ou appliquer un système de design cohérent. Utiliser pour tokens, composants partagés, variantes et règles d’usage.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Système de design

## Méthode

1. Inventorier motifs existants, besoins récurrents et contraintes de marque/accessibilité.
2. Définir tokens sémantiques avant les valeurs locales et limiter les niveaux de variantes.
3. Construire des primitives composables avec états, contenu variable et API documentée.
4. Tester visuellement, au clavier et dans les consommateurs réels avant généralisation.

## Gates

- Une primitive partagée doit couvrir plusieurs usages réels.
- Les contrastes, focus et états désactivés doivent être définis au niveau du système.

## Livrables et contrats

- Tokens, composants, exemples d’usage et stratégie de migration.

## Anti-patterns

- Créer un composant générique sans usages validés.
- Contourner les tokens par des valeurs arbitraires répétées.
