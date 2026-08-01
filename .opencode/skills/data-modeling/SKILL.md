---
name: data-modeling
description: >-
  Concevoir ou faire évoluer un modèle de données persistant. Utiliser pour entités, relations, contraintes et accès.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Modélisation des données

## Méthode

1. Partir du modèle métier, des invariants, volumes, lectures et écritures attendues.
2. Définir identifiants, cardinalités, nullabilité, contraintes et cycle de vie.
3. Modéliser historique, confidentialité, archivage et suppression selon les exigences.
4. Valider le modèle avec requêtes critiques et préparer une migration sûre.

## Gates

- Les invariants importants doivent exister dans la base lorsque possible.
- Chaque donnée sensible doit avoir finalité, accès et rétention définis.

## Livrables et contrats

- `data-model.md`, schéma logique et contraintes vérifiables.

## Anti-patterns

- Optimiser uniquement pour une vue ou un endpoint.
- Stocker des états contradictoires sans règle de cohérence.
