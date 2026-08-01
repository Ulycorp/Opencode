---
description: Affiche l'état vérifié d'un projet ou du portefeuille sans modifier le travail par défaut
agent: global-orchestrator
---

Report workspace or project status for: `$ARGUMENTS`.

This command is read-only by default. Load the `workspace-routing` and `project-context` skills. Do not delegate research, run builds, edit product files, call external data providers, create a commit, or push merely to answer a status request. In particular, do not call `git_checkpoint`; its absence is an intentional read-only policy, not a missing Git step.

## Resolve

1. If `$ARGUMENTS` identifies a project, call `project_resolve` and stop if missing or ambiguous.
2. If it requests `all`, `portfolio`, or contains no project identifier, read `projects/_index.md` and obtain a status snapshot for each indexed active project without launching specialist agents.
3. For one project, call `project_status`, then read `project.yaml`, `STATUS.md`, and only the metadata/frontmatter of the latest reports and run logs needed to verify the snapshot.
4. Inspect Git status and branch with read-only operations when available. Do not fetch, pull, stage, commit, or push in default status mode.

## Verify and present

Reconcile, without silently editing:

- project identity, lifecycle status, domains, and repository references;
- latest verified market, marketing, Web, Mobile, Shopify, legal, and opportunity artifacts;
- `sources_checked_at` freshness and report validation state when recorded;
- current work, blockers, next actions, last run, and last successful checkpoint;
- dirty/untracked project files, branch divergence information already available locally, and unavailable Git state;
- mismatches between `project.yaml`, `STATUS.md`, `projects/_index.md`, and actual artifacts.

Never infer `complete` solely from a file's existence. Distinguish complete, partial, stale, blocked, not started, unavailable, and unknown. Do not expose secrets or include chain-of-thought from logs.

Only if `$ARGUMENTS` explicitly contains a refresh/synchronize request should you perform the mutation workflow; in that case, route the user to `/sync` rather than changing files inside `/status`.

Return a compact status table, evidence paths and timestamps, discrepancies, Git snapshot, blockers, and prioritized next actions. State clearly that no files or remote state were changed.
