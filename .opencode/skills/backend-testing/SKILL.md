---
name: backend-testing
description: >-
  Concevoir et exécuter les tests d’un backend. Utiliser pour logique métier, API, persistance, jobs et intégrations.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
  aliases: "testing-backend"
---

# Tests backend

## Compatibilité

`backend-testing` est le nom canonique. `testing-backend` est un alias strict qui applique ce même contrat sans variante.

## Méthode

1. Dériver les scénarios des invariants, contrats, permissions et modes d’échec.
2. Tester la logique pure en unité et les frontières réelles en intégration ciblée.
3. Couvrir concurrence, idempotence, transaction, erreur externe et autorisation.
4. Rendre données et horloge déterministes puis exécuter la suite pertinente avant livraison.

## Gates

- Un test d’autorisation doit vérifier refus et absence d’effet secondaire.
- Les doubles de test ne doivent pas masquer le contrat de la frontière.

## Livrables et contrats

- Suite backend reproductible et matrice de couverture des risques.

## Anti-patterns

- Tester uniquement les codes HTTP nominaux.
- Partager une base mutable entre tests sans isolation.
