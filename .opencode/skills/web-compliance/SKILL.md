---
name: web-compliance
description: >-
  Auditer les obligations juridiques d’un site ou SaaS. Utiliser pour mentions, comptes, formulaires, cookies, analytics et traitement de données.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "legal"
  version: "1.0.0"
---

# Conformité Web et SaaS

## Méthode

1. Qualifier éditeur, audience, territoires, service, rôles et flux de données.
2. Vérifier mentions, CGU/CGV applicables, propriété intellectuelle, responsabilité et contrats.
3. Tester formulaires, comptes, cookies, consentement, analytics, sous-traitants et droits utilisateurs en lecture seule.
4. Sourcer chaque constat, évaluer priorité et proposer une remédiation vérifiable.

## Gates

- Un texte publié ne compense pas un comportement technique non conforme.
- Distinguer obligation certaine, recommandation et question ouverte.

## Livrables et contrats

- `legal/audits/<date>-web-compliance.md` conforme à `report.v1`.

## Anti-patterns

- Modifier le code pendant l’audit.
- Émettre un verdict global sans preuves par domaine.
