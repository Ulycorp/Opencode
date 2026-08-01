---
name: authz-review
description: >-
  Auditer les contrôles d’accès à des ressources et actions. Utiliser pour tout nouveau rôle, endpoint, mutation ou audit de sécurité.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Revue d’autorisation

## Méthode

1. Construire la matrice sujets, rôles, ressources, actions, tenant et conditions.
2. Tracer chaque contrôle depuis l’entrée jusqu’à l’effet et identifier les chemins alternatifs.
3. Tester refus par défaut, accès horizontal/vertical, propriété, énumération et effets secondaires.
4. Centraliser les règles répétées et documenter exceptions et décisions.

## Gates

- L’autorisation doit être appliquée côté serveur à chaque frontière pertinente.
- Un identifiant difficile à deviner n’est pas un contrôle d’accès.

## Livrables et contrats

- Matrice d’autorisation, tests négatifs et constats corrigés.

## Anti-patterns

- Vérifier uniquement la présence d’une session.
- Dupliquer des règles divergentes dans chaque route.
