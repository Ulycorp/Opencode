---
name: frontend-testing
description: >-
  Tester les comportements d’une interface Web. Utiliser pour composants, formulaires, état, navigation et régressions utilisateur.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Tests frontend

## Méthode

1. Transformer les critères d’acceptation en scénarios observables par l’utilisateur.
2. Tester logique pure et composants au niveau le plus bas qui conserve la confiance.
3. Couvrir chargement, vide, erreur, succès, clavier et variations de données.
4. Ajouter un E2E seulement pour les parcours critiques ou intégrations impossibles à isoler.

## Gates

- Les tests doivent échouer pour une régression réelle, pas pour un détail d’implémentation.
- Éliminer dépendances temporelles et données partagées non maîtrisées.

## Livrables et contrats

- Tests reproductibles et mapping vers les critères d’acceptation.

## Anti-patterns

- Tester uniquement des snapshots massifs.
- Mocker le comportement même que le test prétend vérifier.
