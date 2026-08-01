---
name: architecture-decision-records
description: >-
  Documenter les choix structurants et leurs conséquences. Utiliser lorsqu’une décision affecte plusieurs composants, la sécurité, les données, les coûts ou la maintenabilité.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shared"
  version: "1.0.0"
---

# Décisions d’architecture

## Méthode

1. Décrire le contexte, les forces en présence et les contraintes vérifiables.
2. Comparer les options réellement viables avec bénéfices, coûts, risques et réversibilité.
3. Énoncer la décision, son motif, son propriétaire et sa date.
4. Documenter les conséquences, travaux de suivi et sources dans `DECISIONS.md` ou le dossier `decisions/`.

## Gates

- Une décision doit être explicite et distinguée d’une hypothèse.
- Les alternatives rejetées doivent rester compréhensibles sans chaîne de pensée privée.

## Livrables et contrats

- Un ADR ou une entrée `DECISIONS.md` stable, datée et reliée aux artefacts concernés.

## Anti-patterns

- Enregistrer une préférence sans critères.
- Réécrire silencieusement une ancienne décision.
