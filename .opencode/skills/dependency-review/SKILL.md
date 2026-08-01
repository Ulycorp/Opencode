---
name: dependency-review
description: >-
  Évaluer l’ajout, la mise à jour ou le retrait d’une dépendance. Utiliser avant d’introduire un package ou lors d’une migration de versions.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Revue de dépendances

## Méthode

1. Vérifier besoin réel, alternatives natives, maintenance, licence, taille et compatibilité.
2. Examiner provenance, historique de sécurité, permissions, dépendances transitives et rythme de publication.
3. Tester l’intégration dans un changement minimal avec build et scénarios critiques.
4. Documenter la décision, verrouiller une version adaptée et prévoir la stratégie de mise à jour ou retrait.

## Gates

- Refuser une dépendance abandonnée ou à provenance douteuse sans mitigation explicite.
- Ne jamais exécuter un script d’installation externe non examiné hors du besoin.

## Livrables et contrats

- Décision de dépendance, impact sur lockfile et preuves de compatibilité.

## Anti-patterns

- Ajouter un package pour une fonction triviale.
- Confondre téléchargement élevé et confiance.
