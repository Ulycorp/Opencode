---
name: quality-gate-web
description: >-
  Décider si une livraison Web satisfait les exigences fonctionnelles et non fonctionnelles. Utiliser avant merge ou déploiement.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Gate qualité Web

## Méthode

1. Rassembler critères d’acceptation, changements, environnements et risques.
2. Exécuter lint, types, tests, E2E critiques et vérifications de build.
3. Intégrer sécurité, accessibilité, performance pertinente et documentation.
4. Émettre un verdict pass, pass-with-risk ou fail avec preuves et actions.

## Gates

- Aucun test requis échoué ou non expliqué ne peut être ignoré.
- Un risque résiduel doit avoir propriétaire et décision explicite.

## Livrables et contrats

- Rapport de gate avec commandes, résultats, artefacts et verdict.

## Anti-patterns

- Réduire le gate à « le build passe ».
- Relancer jusqu’au vert sans diagnostiquer une instabilité.
