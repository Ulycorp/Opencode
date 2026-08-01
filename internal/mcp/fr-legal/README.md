# MCP `fr-legal`

Serveur MCP local en lecture seule qui normalise des sources juridiques françaises officielles.

## Capacités

- Légifrance via l'API officielle PISTE : lois, articles, codes, jurisprudence et documents.
- BOFiP via les jeux de données officiels de `data.economie.gouv.fr`.
- CNIL via une consultation contrôlée des pages publiques officielles quand aucune API adaptée n'existe.

Toutes les réponses incluent la source, l'identifiant, le titre, le statut, la date, l'URL, le texte et `retrieved_at`. Le serveur ne fabrique jamais un document lorsque la source est indisponible.

## Configuration

Copier les noms de variables de `.env.example` dans l'environnement local. Pour Légifrance, créer une application PISTE, accepter les CGU de l'API et utiliser des identifiants correspondant au même environnement que les URLs.

Variables obligatoires pour PISTE :

- `PISTE_CLIENT_ID`
- `PISTE_CLIENT_SECRET`

Variables optionnelles :

- `PISTE_TOKEN_URL`
- `PISTE_API_BASE_URL`
- `BOFIP_DATASET_API_URL`
- `CNIL_SEARCH_BASE_URL`
- `FR_LEGAL_HTTP_TIMEOUT_MS`
- `FR_LEGAL_MAX_TEXT_CHARS`

Toutes les URLs doivent utiliser HTTPS et rester sur les hôtes officiels autorisés :

- PISTE OAuth : `oauth.piste.gouv.fr` ;
- API PISTE / Légifrance : `api.piste.gouv.fr` ;
- Légifrance public : `legifrance.gouv.fr` et ses sous-domaines ;
- BOFiP : `data.economie.gouv.fr` et `bofip.impots.gouv.fr` selon le provider ;
- CNIL : `cnil.fr` et ses sous-domaines.

Chaque redirection est suivie manuellement, limitée et revalidée avec la même allowlist. Les en-têtes sensibles sont supprimés lors d'un changement d'origine et aucun credential PISTE n'est envoyé avant validation de l'hôte cible.

## Exécution

Depuis la racine, après `npm install` :

```powershell
npm run fr-legal:inspect
```

La configuration OpenCode lance le serveur avec le transport stdio. N'écrire aucun log sur stdout pendant ce transport : stdout est réservé au protocole MCP.

## Limites

Les résultats sont des sources pour un audit assisté et ne constituent pas un conseil juridique. L'état en vigueur, la date, le champ d'application et la version du texte doivent être vérifiés avant toute conclusion.
