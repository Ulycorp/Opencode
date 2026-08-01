---
name: legal-report
description: >-
  Rédiger un audit juridique sourcé, prudent et actionnable. Utiliser après collecte des faits techniques et sources officielles.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "legal"
  version: "1.0.0"
---

# Rapport juridique

## Méthode

1. Rappeler périmètre, date, faits observés, hypothèses et limites de compétence.
2. Structurer exigences, état observé, preuves, analyse, risque et recommandation par thème.
3. Citer texte, statut, URL et date; distinguer loi, règlement, doctrine, jurisprudence et interprétation.
4. Prioriser actions, signaler les validations professionnelles requises et exécuter `report_validate`.

## Gates

- Ne jamais conclure au-delà des faits ou sources disponibles.
- Le rapport ne contient ni chaîne de pensée, secret, ni modification de code.

## Livrables et contrats

- Rapport `report.v1` sous `projects/<slug>/legal/**` avec sources consultées.

## Anti-patterns

- Donner une assurance absolue de conformité.
- Masquer une incertitude pour rendre le rapport plus catégorique.
