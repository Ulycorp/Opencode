# Guide des commandes OpenCode

Ce guide présente les commandes personnalisées du workspace OpenCode ainsi que les principales commandes natives utiles.

Toutes les commandes personnalisées sont exécutées par `global-orchestrator`, qui route ensuite le travail vers les orchestrateurs et les agents spécialisés autorisés.

## Commandes de gestion de projet

### `/projet`

Initialise un nouveau projet et lance les trois analyses initiales obligatoires :

- SEO/GEO ;
- intelligence e-commerce ;
- publicité.

```text
/projet MonProjet
```

Le projet est créé sous `projects/monprojet/`. L'agent `opportunity-researcher` n'est pas appelé automatiquement.

### `/status`

Affiche l'état vérifié d'un projet sans modifier le code ni lancer de recherche.

```text
/status MonProjet
```

La commande affiche notamment les livrables présents, les blocages, les dernières exécutions et l'état Git.

### `/sync`

Synchronise les métadonnées, les index, les validations et Git.

```text
/sync MonProjet
/sync MonProjet metadata
/sync MonProjet reports
/sync MonProjet git
/sync all
```

Cette commande ne lance pas de nouvelle recherche et ne construit pas de fonctionnalité. C'est la seule commande autorisée à demander un rebase Git sûr.

## Commandes de recherche

### `/market`

Lance ou actualise les études de marché principales : SEO/GEO, intelligence e-commerce et publicité.

```text
/market MonProjet
/market MonProjet concurrents et positionnement
```

Cette commande ne lance pas la recherche d'aides, d'événements ou de subventions. Utilise `/opportunity` pour cela.

### `/opportunity`

Recherche à la demande des opportunités actuelles et vérifiées : subventions, concours, aides, événements, partenariats et appels à projets.

```text
/opportunity MonProjet subventions France 2026
/opportunity MonProjet partenariats SaaS Europe
```

## Commandes marketing

### `/marketing`

Produit une stratégie marketing complète : persona, positionnement, stratégie de campagne, canaux, messages, briefs créatifs et assets accompagnés de metadata.

```text
/marketing MonProjet lancement d'une application mobile
/marketing MonProjet acquisition B2B LinkedIn
```

## Commandes de développement

### `/build-web`

Planifie, implémente et teste une application Web.

```text
/build-web MonProjet créer une landing page responsive
/build-web MonProjet ajouter une authentification utilisateur
```

Le code reste limité au dépôt indépendant déclaré dans `project.yaml`, par défaut `dev/<slug>/web`.

La commande peut coordonner l'architecture, le frontend, le backend, la data, la sécurité, la QA, la performance et la validation Git.

### `/build-mobile`

Planifie, implémente et qualifie une application mobile iOS/Android.

```text
/build-mobile MonProjet créer l'écran de connexion
/build-mobile MonProjet ajouter les notifications push
```

Le code reste limité au dépôt indépendant déclaré dans `project.yaml`, par défaut `dev/<slug>/mobile`.

Les builds iOS/Android et EAS nécessitent les outils et credentials correspondants. Un VPS Linux ne peut pas compiler iOS localement ; un service EAS ou un runner macOS est nécessaire.

### `/build-shopify`

Construit ou modifie un thème, une extension ou un catalogue Shopify en preview.

```text
/build-shopify MonProjet créer une page produit premium
/build-shopify MonProjet ajouter un metafield produit
```

Le code reste limité au dépôt indépendant déclaré dans `project.yaml`, par défaut `dev/<slug>/shopify`.

La commande peut effectuer l'analyse du thème, l'implémentation Liquid ou d'extension, Theme Check, la QA, l'audit sécurité et la préparation d'une preview non publiée. Elle ne publie pas automatiquement en production.

## Commande d'audit

### `/audit`

Effectue un audit contrôlé et produit un rapport traçable.

Scopes disponibles :

```text
legal
web
mobile
shopify
security
performance
all
```

Exemples :

```text
/audit MonProjet legal
/audit MonProjet web security
/audit MonProjet mobile performance
/audit MonProjet all
```

L'audit est en lecture seule concernant le code et les boutiques, mais il écrit les rapports dans les dossiers dédiés :

```text
projects/<slug>/legal/audits/
dev/<slug>/web/docs/opencode/audits/
dev/<slug>/mobile/docs/opencode/audits/
dev/<slug>/shopify/docs/opencode/audits/
```

## Commandes OpenCode natives utiles

Ces commandes sont fournies par OpenCode et ne sont pas spécifiques au workspace.

### `/connect`

Connecte OpenAI, ChatGPT Plus/Pro ou un autre provider.

Pour ton abonnement ChatGPT :

```text
/connect
```

Puis sélectionne `OpenAI` et `ChatGPT Plus/Pro`.

### `/models`

Affiche et sélectionne le modèle actif.

### `/help`

Affiche l'aide OpenCode.

### `/undo`

Annule la dernière modification effectuée par OpenCode.

### `/redo`

Rétablit une modification annulée.

### `/share`

Partage la conversation si cette fonction est activée.

## Navigation entre agents

- `Tab` sélectionne `Build`, `Plan` et les orchestrateurs du workspace ;
- `@nom-agent` appelle un agent spécialisé ;
- les commandes `/...` déclenchent les workflows du workspace.

Les définitions détaillées se trouvent dans `.opencode/commands/` et `.opencode/agents/`.
