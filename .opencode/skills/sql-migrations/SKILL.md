---
name: sql-migrations
description: >-
  Écrire et vérifier une évolution de schéma SQL. Utiliser pour création, modification, backfill, index ou contrainte.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Migrations SQL

## Méthode

1. Mesurer état actuel, volume, dépendances et compatibilité des versions applicatives.
2. Découper expand, backfill, validation puis contract lorsque le changement est risqué.
3. Rendre la migration transactionnelle ou reprenable et borner les verrous.
4. Tester sur données représentatives, vérifier rollback/roll-forward et documenter l’ordre de déploiement.

## Gates

- Une migration destructive exige sauvegarde, gate et chemin de récupération.
- Aucune contrainte coûteuse n’est ajoutée sans analyse de verrouillage.

## Livrables et contrats

- Migration versionnée, procédure d’exécution et preuves de validation.

## Anti-patterns

- Renommer ou supprimer en une seule étape avec des clients actifs.
- Faire un backfill non borné pendant une release critique.
