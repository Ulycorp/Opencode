---
name: react-next
description: >-
  Construire ou modifier une application React ou Next.js. Utiliser lorsque le projet emploie ces frameworks et que les choix de rendu ou de frontières serveur-client comptent.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# React et Next.js

## Méthode

1. Détecter version, routeur, conventions et capacités effectivement utilisées par le dépôt.
2. Choisir composant serveur ou client, stratégie de données, cache et mutation selon le besoin.
3. Isoler les effets, stabiliser les clés et états, puis gérer erreurs, suspense et navigation.
4. Tester rendu serveur/client, hydratation, routes, metadata et bundle affecté.

## Gates

- N’ajouter une frontière client que pour une interaction nécessitant le navigateur.
- Ne jamais exposer une variable serveur dans le bundle client.

## Livrables et contrats

- Composants et routes conformes aux conventions du projet avec tests ciblés.

## Anti-patterns

- Appliquer une recette d’une autre version du framework.
- Utiliser un effet pour dériver un état calculable au rendu.
