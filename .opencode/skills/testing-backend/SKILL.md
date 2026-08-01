---
name: testing-backend
description: >-
  Compatibilité pour les agents référençant l’ancien nom `testing-backend`. Utiliser exactement dans les mêmes cas que `backend-testing`.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
  alias-of: "backend-testing"
---

# Alias testing-backend

## Méthode

1. Appliquer intégralement le workflow du skill `backend-testing`.
2. Conserver les mêmes critères sur invariants, API, persistance, concurrence et autorisation.
3. Produire les mêmes preuves et résultats reproductibles.
4. Préférer le nom canonique `backend-testing` dans toute nouvelle configuration.

## Gates

- Ne pas créer une seconde politique de tests divergente.
- Toute évolution de cet alias doit rester alignée sur `backend-testing`.

## Livrables et contrats

- Les livrables définis par `backend-testing`, sans variante contractuelle.

## Anti-patterns

- Interpréter cet alias comme une spécialité distincte.
- Référencer les deux skills simultanément dans un même agent.
