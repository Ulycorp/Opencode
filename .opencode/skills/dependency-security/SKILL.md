---
name: dependency-security
description: >-
  Auditer les risques de sécurité de dépendances et chaîne d’approvisionnement. Utiliser à l’ajout, la mise à jour et avant release.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Sécurité des dépendances

## Méthode

1. Inventorier dépendances directes/transitives, sources, lockfiles et scripts d’installation.
2. Analyser avis connus, maintenance, signatures/provenance, permissions et exposition réelle.
3. Prioriser selon exploitabilité dans le projet et identifier version corrigée ou mitigation.
4. Mettre à jour de façon ciblée puis exécuter build, tests et contrôle de régression.

## Gates

- Une alerte critique exploitable doit être corrigée ou formellement acceptée.
- Conserver un lockfile cohérent et vérifier tout changement transitif inattendu.

## Livrables et contrats

- Inventaire, analyse d’exposition et preuve de remédiation.

## Anti-patterns

- Mettre à jour toutes les versions aveuglément.
- Ignorer une alerte uniquement parce qu’elle est transitive.
