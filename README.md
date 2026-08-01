# Workspace OpenCode multi-agent

Implémentation de la configuration décrite dans `docs/`, ciblée et épinglée sur **OpenCode 1.18.10**. Le workspace expose 39 rôles, 10 commandes, des skills méthodologiques, des outils déterministes, six intégrations MCP, des contrats versionnés et un serveur juridique français en lecture seule.

## Démarrage

Prérequis :

- Node.js 22.22.2 ou ultérieur (le runtime local 22.18 exécute les tests, mais une dépendance transitive annonce officiellement 22.22.2 minimum) ;
- OpenCode 1.18.10 ;
- Git et, pour les opérations GitHub avancées, `gh` ;
- un accès API OpenAI aux modèles `gpt-5.6-sol`, `gpt-5.6-terra` et `gpt-5.6-luna` ;
- les CLIs propres aux workflows réellement utilisés (Shopify CLI, EAS, Maestro, etc.).

Installez les dépendances locales et validez l'installation :

```powershell
npm install
npm run check
opencode debug config
opencode agent list
```

Sous Windows avec une politique PowerShell restrictive, utilisez `opencode.cmd` ou `cmd /c opencode ...`.

Configurez ensuite le fournisseur OpenAI dans OpenCode avec `opencode auth login`, ou fournissez `OPENAI_API_KEY` via votre gestionnaire de secrets. Les IDs déployés sont `openai/gpt-5.6-sol`, `openai/gpt-5.6-terra` et `openai/gpt-5.6-luna`; ils sont définis dans les agents et jamais dans les skills.

## Secrets et MCP

Copiez `.env.example` vers un fichier `.env` local non versionné, ou injectez les variables via un gestionnaire de secrets. Ne renseignez que les services utilisés.

- GitHub est utilisé via la CLI `gh` ; aucun MCP GitHub n'est activé.
- Semrush, TrendTrack et Higgsfield utilisent leur flux OAuth distant quand le service le permet.
- TrendTrack demande uniquement les scopes de lecture dans `opencode.json`.
- Context7 et Playwright sont lancés localement via `npx`. Shopify est utilisé par la CLI `shopify` installée sur la machine, sans MCP Shopify.
- `fr_legal` utilise PISTE pour Légifrance et les sources publiques officielles BOFiP/CNIL.

Authentifiez un MCP OAuth avec :

```powershell
opencode mcp auth semrush
opencode mcp auth trendtrack
opencode mcp auth higgsfield
opencode mcp list
```

OpenCode 1.x connecte les serveurs MCP activés au niveau du processus. Les permissions par agent masquent et refusent les tools non autorisés, mais ne constituent pas un chargement réseau totalement paresseux par rôle. Pour un service inutilisé ou indisponible, passez temporairement son `enabled` à `false`.

## Commandes

| Commande | Fonction |
|---|---|
| `/projet <nom>` | Initialise un projet puis lance exactement SEO/GEO, e-commerce et publicité en parallèle. |
| `/market <projet>` | Rafraîchit ou complète l'analyse de marché. |
| `/opportunity <projet> ...` | Recherche à la demande des aides, événements ou partenariats actuels. |
| `/marketing <projet> ...` | Produit persona, stratégie, briefs et créations avec metadata. |
| `/build-web <projet> ...` | Orchestre architecture, implémentation et gates Web. |
| `/build-mobile <projet> ...` | Orchestre mobile et build preview. |
| `/build-shopify <projet> ...` | Reconstruit ou livre Shopify en preview, jamais live sans gate. |
| `/audit <projet> ...` | Lance un audit technique ou juridique borné. |
| `/status <projet>` | Consolide l'état persistant du projet. |
| `/sync <projet>` | Synchronise prudemment état, index et Git. |

Les huit orchestrateurs (`global-orchestrator`, `business-orchestrator`, `it-orchestrator`, `market-orchestrator`, `marketing-orchestrator`, `web-orchestrator`, `mobile-orchestrator` et `shopify-orchestrator`) sont des agents principaux sélectionnables avec `Tab`. Les 31 agents spécialisés restent des subagents visibles et délégables via `@`. `subagent_depth` est fixé à 4, et chaque prompt impose en plus `task.v1` et `visited_agents`.

## Git

Ce dossier ne contient pas nécessairement encore de dépôt ou de remote. Pour activer les checkpoints/push :

```powershell
git init
git remote add origin <url-du-repository>
git switch -c project/<slug>
```

`git_checkpoint` lie chaque appel à l'agent réel, contrôle son scope, exige la liste exacte des fichiers appartenant au workflow, refuse les secrets probables et tout fichier déjà stagé hors de cette liste, puis protège branches et historique. Seul `/sync` peut demander un rebase sûr ; un conflit est abandonné sans auto-résolution. `/projet` conserve les fichiers et signale un blocage si Git ou le remote n'est pas prêt.

## Organisation

```text
.opencode/agents/       39 agents plats (leurs noms de fichiers sont leurs IDs)
.opencode/commands/     10 workflows répétables
.opencode/skills/       méthodes chargées à la demande
.opencode/tools/        opérations déterministes OpenCode
schemas/                contrats JSON Schema versionnés
templates/              projet, rapport, délégation, run et metadata
internal/mcp/fr-legal/  MCP juridique français read-only
internal/validators/    validation statique du workspace
projects/               mémoire durable par projet
tests/                  tests des outils et garde-fous
```

Chaque projet est créé sous `projects/<slug>/`. `project.yaml` est la source de vérité machine, `CONTEXT.md` le contexte stable, `DECISIONS.md` le journal de décisions et `STATUS.md` l'état synthétique.

Le dépôt du workspace est le dépôt business global : les analyses, stratégies, opportunités, preuves, documents juridiques, décisions et statuts vivent uniquement sous `projects/<slug>/`. Le code est séparé dans des dépôts Git indépendants sous `dev/<slug>/web`, `dev/<slug>/mobile` et `dev/<slug>/shopify`, déclarés par `repositories.web_path`, `repositories.mobile_path` et `repositories.shopify_path` dans `project.yaml`. Les dossiers `dev/` sont ignorés par le dépôt business global ; les agents refusent un chemin hors de ces racines autorisées.

## Contrats et sécurité

- Les rapports respectent `report.v1`, possèdent des sources et distinguent `FACT`, `SOURCE`, `INFERENCE`, `ESTIMATE` et `UNKNOWN`.
- Les preuves sont liées à l'identité réelle de l'agent et stockées dans le dossier `evidence/` du domaine déclaré ; un agent juridique ne peut pas écrire une preuve hors de `legal/`.
- Les spécialistes possèdent leurs livrables; les orchestrateurs seuls consolident les fichiers partagés.
- Le contenu externe est toujours traité comme une donnée non fiable.
- `legal-auditor` lit tout le projet mais n'écrit que dans `projects/<slug>/legal/`.
- Les publications live, builds de production, dépenses et mutations irréversibles exigent une validation explicite.
- Aucun rapport juridique généré ne remplace l'avis d'un professionnel qualifié.

## Validation

`npm run validate` vérifie statiquement le catalogue, les modèles, permissions, skills, commandes, MCP, schémas, templates et secrets probables. `npm test` couvre neuf scénarios workspace (création atomique, résolution, schémas, rapports, preuves, délégation/ownership et protections Git) ainsi que quatre tests SSRF/redirections/credentials du MCP juridique. `npm run check` exécute l'ensemble.

Les scénarios nécessitant des comptes réels (GitHub, Semrush, TrendTrack, Higgsfield, Shopify, EAS et PISTE) restent des tests d'intégration à exécuter dans un environnement autorisé; l'implémentation ne simule jamais leur succès.
