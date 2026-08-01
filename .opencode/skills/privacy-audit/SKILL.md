---
name: privacy-audit
description: >-
  Auditer données personnelles, cookies, consentement et sécurité. Utiliser pour Web, mobile, Shopify, analytics ou nouvelle intégration traitant des personnes.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "legal"
  version: "1.0.0"
---

# Audit vie privée

## Méthode

1. Cartographier données, personnes, finalités, bases, sources, destinataires, transferts et rétention.
2. Examiner minimisation, information, droits, consentement, sous-traitants et sécurité.
3. Vérifier implémentation observable dans code/configuration en lecture seule et sources CNIL/textes actuels.
4. Classer écarts, risques, preuves, remédiations et sujets nécessitant conseil ou DPIA.

## Gates

- Aucune finalité ou collecte ne doit être inventée à partir d’un seul nom de champ.
- Les traceurs soumis à consentement ne doivent pas être considérés conformes sans test du comportement.

## Livrables et contrats

- Rapport privacy sous `legal/privacy/` ou `legal/audits/`, conforme à `report.v1`.

## Anti-patterns

- Réduire le RGPD à une bannière cookies.
- Confondre chiffrement et base légale.
