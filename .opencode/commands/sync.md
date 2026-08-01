---
description: Réconcilie les métadonnées projet, l'index, les validations et Git sans écraser le travail existant
agent: global-orchestrator
---

Synchronize project state according to: `$ARGUMENTS`.

Expect a project identifier or explicit `all`, plus optional `metadata`, `reports`, or `git` scope. This workflow reconciles existing artifacts; it does not generate new research, marketing, code, audits, or opportunities. Load the authorized shared skills `workspace-routing`, `project-context`, `report-contract`, `evidence-policy`, `git-workflow`, and `secret-handling`. Do not load `release-gate`; synchronization does not perform a release.

## Inspect before mutation

1. Resolve each requested project with `project_resolve`. For `all`, use the project index and process projects one at a time; do not allow one failure to corrupt another project.
2. Call `project_status`, then read `project.yaml`, `STATUS.md`, latest run logs, report frontmatter, and the relevant row in `projects/_index.md`.
3. Inspect Git branch, status, diff, remotes, and divergence safely before writing. Preserve all unknown, uncommitted, untracked, and concurrent user changes.
4. Stop and report rather than guessing if identities conflict, a schema migration is required, the worktree contains overlapping edits, or the project path escapes `projects/<slug>/`.

## Reconcile deterministic state

1. Validate `project.yaml` against `schemas/project.schema.json`; do not invent fields or silently discard unknown valid data.
2. Call `report_validate` for new or changed Markdown reports. Do not rewrite research conclusions during sync. Invalid reports remain invalid and are listed as blockers.
3. Reconcile `STATUS.md` from validated artifacts and recorded gate/run results only. File existence alone is not proof of completion.
4. Update `project.yaml` timestamps and defined status fields only when supported by evidence and schema.
5. Call `project_index` after each successfully reconciled project so `projects/_index.md` reflects canonical state.
6. Process one project completely before mutating the next. Build `checkpoint_paths` from only changed `project.yaml`, `STATUS.md`, `DECISIONS.md`, and `projects/_index.md`; validation reads do not make reports or evidence eligible for the checkpoint.
7. Add `projects/<slug>/logs/runs/<timestamp>-sync.md` to `checkpoint_paths`, then finalize the log with inspected inputs, metadata changes, validations, discrepancies, skipped items, errors, and the planned request `{ scope: status, paths: checkpoint_paths, message: chore(sync): reconcile workspace state for <slug>, push: true, rebase: true }`. Never include secrets, personal data, credentials, chain-of-thought, or a future commit hash.

No specialist agent should be invoked. If stale or missing domain work is discovered, list the appropriate follow-up command instead of performing it.

## Safe Git synchronization

Call `git_checkpoint` for each project with exactly `{ project: "<slug>", scope: "status", paths: checkpoint_paths, message: "chore(sync): reconcile workspace state for <slug>", push: true, rebase: true }`. `/sync` is the only command allowed to pass `rebase: true`. Never pass an unsupported `sync` scope, a directory, an unchanged report/evidence file, or a path owned by another project.

Before any push, fetch and compare histories. Rebase only when the tool determines it is safe and non-conflicting. On divergence, conflicts, protected-branch restrictions, missing remote/authentication, or overlapping edits, stop that project's Git step, preserve all files, and report the exact blocker. Never force-push, reset, clean, delete branches, rewrite history, auto-resolve unknown conflicts, or overwrite remote work. Do not rewrite the finalized run log after the call; return the actual checkpoint result to the user.

For `all`, do not bundle unrelated project content into one unchecked commit; report checkpoint results per project. A failed Git step must not be described as synchronized remotely.

Return projects processed, metadata/index changes, report validation results, local and remote Git state, commits/pushes actually completed, discrepancies, recommended follow-up commands, and blockers.
