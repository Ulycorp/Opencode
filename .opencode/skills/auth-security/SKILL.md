---
name: auth-security
description: >-
  Concevoir ou auditer authentification et sessions. Utiliser pour login, inscription, récupération, MFA, tokens ou fédération.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Sécurité d’authentification

## Méthode

1. Cartographier acteurs, facteurs, sessions, terminaux, menaces et exigences de récupération.
2. Choisir des mécanismes éprouvés et définir émission, stockage, rotation, révocation et expiration.
3. Protéger bruteforce, fixation, énumération, CSRF et redirections.
4. Tester succès, échec, expiration, révocation et récupération sur chaque canal.

## Gates

- Aucun token sensible ne doit apparaître dans URL, logs ou stockage inadapté.
- La récupération de compte ne doit pas être plus faible que l’authentification normale.

## Livrables et contrats

- Flux d’authentification documentés, contrôles et tests de sécurité.

## Anti-patterns

- Inventer un protocole cryptographique.
- Confondre identité authentifiée et droit d’effectuer une action.
