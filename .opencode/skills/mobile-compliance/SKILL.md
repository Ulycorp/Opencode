---
name: mobile-compliance
description: >-
  Auditer les obligations juridiques d’une application mobile. Utiliser pour privacy, permissions, tracking, comptes, abonnements et achats intégrés.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "legal"
  version: "1.0.0"
---

# Conformité mobile

## Méthode

1. Identifier plateformes, audience, territoires, données, permissions et modèle économique.
2. Vérifier politique de confidentialité, information in-app, consentement, tracking et suppression de compte.
3. Examiner abonnements, achats, renouvellement, données sensibles et exigences store pertinentes.
4. Comparer code/configuration en lecture seule aux sources officielles et classer les écarts.

## Gates

- Une permission déclarée doit correspondre à un usage nécessaire et expliqué.
- Les règles store sont distinguées des obligations légales.

## Livrables et contrats

- Rapport `legal/audits/<date>-mobile-compliance.md` sourcé.

## Anti-patterns

- Considérer l’acceptation store comme preuve de conformité.
- Omettre les comportements réels derrière les déclarations de privacy.
