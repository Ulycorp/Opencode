---
name: owasp-web-review
description: >-
  Auditer une application Web selon les risques OWASP et son contexte métier. Utiliser pendant l’architecture, avant merge, avant déploiement ou sur demande d’audit.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Revue OWASP Web

## Méthode

1. Définir périmètre, actifs, rôles, flux et environnements explicitement autorisés.
2. Examiner contrôle d’accès, injections, configuration, crypto, auth, intégrité, journalisation, SSRF et logique métier.
3. Corroborer analyse de code, configuration, dépendances et tests non destructifs.
4. Classer les constats avec preuve, scénario d’impact, correction et vérification.

## Gates

- Ne tester activement que les environnements autorisés.
- Bloquer toute faille critique ou accès transversal non corrigé.

## Livrables et contrats

- Rapport d’audit dans `it/web/audits/` et verdict du gate sécurité.

## Anti-patterns

- Transformer une checklist OWASP en preuve de sécurité.
- Fournir des charges exploitables inutiles au rapport.
