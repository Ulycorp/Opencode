---
name: software-delivery
description: >-
  Piloter une livraison logicielle de la compréhension du besoin à une version vérifiée. Utiliser pour les créations, modifications, migrations et corrections de produits numériques.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "shared"
  version: "1.0.0"
---

# Livraison logicielle

## Méthode

1. Définir le périmètre, les critères d’acceptation, les contraintes et le plan de retour arrière.
2. Faire documenter l’architecture et les contrats avant les changements à fort couplage.
3. Implémenter par incréments vérifiables avec tests et documentation au même rythme.
4. Exécuter les gates de qualité, produire le compte rendu puis préparer le checkpoint Git ou la release.

## Gates

- Une compilation seule ne constitue jamais une livraison terminée.
- Toute modification hors périmètre doit être isolée ou explicitement approuvée.

## Livrables et contrats

- Code et documentation cohérents, preuves de tests, risques résiduels et instructions de livraison.

## Anti-patterns

- Ajouter des fonctions non demandées sans justification.
- Masquer un test impossible ou un risque de déploiement.
