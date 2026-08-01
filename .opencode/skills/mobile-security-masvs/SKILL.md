---
name: mobile-security-masvs
description: >-
  Auditer une application mobile selon OWASP MASVS/MASTG. Utiliser pendant l’architecture, avant release ou pour un audit ciblé.
compatibility: "opencode >= 1.18.10"
metadata:
  category: "mobile"
  version: "1.0.0"
---

# Sécurité mobile MASVS

## Méthode

1. Définir périmètre, plateforme, profil MASVS, actifs, données et menaces applicables.
2. Examiner stockage, crypto, auth, réseau, plateforme, code, résilience et privacy.
3. Combiner revue de code/configuration, analyse de build et tests autorisés sur appareil.
4. Classer preuves et remédiations puis réévaluer le risque résiduel.

## Gates

- Les secrets ou tokens ne doivent pas être récupérables depuis un stockage inadapté.
- Une permission ou donnée sensible inutile bloque la validation privacy.

## Livrables et contrats

- Rapport dans `it/mobile/audits/` avec couverture MASVS et verdict.

## Anti-patterns

- Appliquer toutes les exigences sans profil de risque.
- Considérer l’obfuscation comme un contrôle d’accès.
