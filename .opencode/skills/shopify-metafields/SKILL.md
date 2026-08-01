---
name: shopify-metafields
description: >-
  Modéliser et gérer des données personnalisées Shopify. Utiliser pour contenu structuré attaché aux ressources ou réutilisable.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shopify"
  version: "1.0.0"
---

# Metafields et metaobjects

## Méthode

1. Définir propriétaire, namespace, clé, type, cardinalité et cycle de vie.
2. Choisir metafield ou metaobject selon réutilisation, relations et édition.
3. Créer définitions et validations avant de peupler les valeurs.
4. Tester accès thème/API, valeurs absentes, migration et suppression.

## Gates

- Éviter doublons avec champs natifs ou données déjà structurées.
- Une définition partagée ne doit pas changer de type sans migration.

## Livrables et contrats

- Dictionnaire de données Shopify et procédure de peuplement/migration.

## Anti-patterns

- Stocker du JSON libre quand un type structuré existe.
- Coder des IDs de ressources propres à une boutique.
