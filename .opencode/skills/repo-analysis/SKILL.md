---
name: repo-analysis
description: >-
  Inspecter un dépôt avant planification ou modification. Utiliser pour comprendre une base existante, localiser les conventions et mesurer l’impact d’un changement.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shared"
  version: "1.0.0"
---

# Analyse de dépôt

## Méthode

1. Lire les instructions du dépôt, les manifestes, la configuration, l’état Git et les points d’entrée.
2. Cartographier les modules, dépendances, flux de données, tests, CI et frontières de déploiement.
3. Tracer les symboles et usages liés à la demande avec recherche ciblée et outils de langage.
4. Résumer les faits observés, zones d’incertitude, risques et fichiers probablement concernés.

## Gates

- Préserver les changements utilisateur déjà présents.
- Fonder les conclusions sur des fichiers ou sorties observables.

## Livrables et contrats

- Une carte concise du dépôt et une analyse d’impact avec références de chemins.

## Anti-patterns

- Lire récursivement tout le dépôt sans stratégie.
- Modifier le code pendant une mission limitée au diagnostic.
