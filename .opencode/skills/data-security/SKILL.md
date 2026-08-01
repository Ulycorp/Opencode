---
name: data-security
description: >-
  Protéger données stockées et échangées. Utiliser pour contrôle d’accès, chiffrement, RLS, rétention, export ou suppression.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "web"
  version: "1.0.0"
---

# Sécurité des données

## Méthode

1. Classifier les données, finalités, propriétaires, juridictions et durées de conservation.
2. Cartographier accès, flux, sauvegardes, exports et frontières de confiance.
3. Appliquer moindre privilège, isolation, chiffrement adapté et contrôles au niveau pertinent.
4. Tester accès autorisés/interdits, suppression, restauration et fuite par observabilité.

## Gates

- Le contrôle client ne remplace jamais l’autorisation serveur ou base.
- Les sauvegardes doivent respecter les mêmes exigences que les données actives.

## Livrables et contrats

- Matrice données-accès-rétention et preuves de contrôles.

## Anti-patterns

- Collecter une donnée sans finalité définie.
- Utiliser le chiffrement pour compenser un contrôle d’accès absent.
