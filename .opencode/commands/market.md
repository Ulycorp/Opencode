---
description: Lance ou actualise les études de marché principales d'un projet existant
agent: global-orchestrator
---

Run market research for an existing project according to: `$ARGUMENTS`.

Interpret the first project identifier or unambiguous project name, followed by an optional scope or refresh request. As `global-orchestrator`, load `workspace-routing`, `project-context`, `task-delegation`, `report-contract`, `evidence-policy`, `untrusted-content-policy`, and `git-workflow`. Require the delegated market agents to load `source-quality` and their domain skills.

## Resolve and plan

1. Call `project_resolve`; if the project is missing or ambiguous, stop before writing.
2. Read `projects/<slug>/project.yaml`, `CONTEXT.md`, `STATUS.md`, the existing market synthesis, and relevant existing market reports.
3. Determine freshness from `sources_checked_at`. Do not repeat a costly study when a current report already answers the request unless `$ARGUMENTS` explicitly requests refresh.
4. Default scope is the three core studies: SEO/GEO, e-commerce intelligence, and advertising intelligence. A narrower explicit scope runs only the matching specialist.
5. This command does not run opportunity research. If `$ARGUMENTS` asks for grants, events, funding, tenders, partnerships, or other opportunities, direct that portion to `/opportunity` instead of invoking `opportunity-researcher` here.

Delegate through `market-orchestrator`, launching independent selected specialists concurrently:

- `seo-geo-researcher` -> `projects/<slug>/market-research/seo-geo.md`
- `ecommerce-intelligence` -> `projects/<slug>/market-research/ecommerce-intelligence.md`
- `advertising-intelligence` -> `projects/<slug>/market-research/advertising-intelligence.md`

Each delegation must be a complete `task.v1` contract including a UUID `task_id`, `project_id`, `requested_by`, target agent, bounded objective, expected output, exact output path, `delegation_depth`, `visited_agents`, and deadline policy. Call `task_validate` before dispatch. Depth must not exceed 4 and an already visited agent must not be recalled for the same subtask.

Specialists own only their assigned report. They must use attributable current sources, call `evidence_register` with `scope: "market"` for material evidence, return every exact evidence path produced, label confidence, disclose MCP failures and fallbacks, and never edit shared status files. Concurrent tasks must write different files.

## Validate and synthesize

1. Call `report_validate` for every produced or refreshed report.
2. Give an invalid report back to its owner for one bounded correction; unresolved failures block completion.
3. When every selected output is valid, have `market-orchestrator` regenerate `projects/<slug>/market-research/synthesis.md` from all valid current core reports, clearly noting any missing or stale domain.
4. Validate the synthesis with `report_validate`.
5. Only the orchestrator updates `project.yaml` market status and timestamps, then `STATUS.md`.
6. Call `project_index` after status consolidation.
7. Build `checkpoint_paths` from only files actually created or changed: selected specialist reports, the regenerated synthesis, every returned evidence path, and changed `project.yaml`, `STATUS.md`, `DECISIONS.md`, or `projects/_index.md`. Reused unchanged reports must not be listed.
8. Add `projects/<slug>/logs/runs/<timestamp>-market.md` to `checkpoint_paths`, then finalize the log with scope, agents, files, source dates, validations, fallbacks, errors, and the planned request `{ scope: market, paths: checkpoint_paths, message: research(market): refresh analysis for <slug>, push: true, rebase: false }`. Do not log secrets, chain-of-thought, or a future commit hash.

Call `git_checkpoint` with `{ project: "<slug>", scope: "market", paths: checkpoint_paths, message: "research(market): refresh analysis for <slug>", push: true, rebase: false }`. The paths must be exact files, never the whole domain directory. Never force-push, reset, clean, overwrite remote work, or push directly to an unapproved protected branch. Do not modify the run log after the call; return the actual checkpoint result to the user. Preserve the reports and report a blocker when safe commit/push is unavailable.

Return the resolved project, requested scope, freshness decisions, reports changed or reused, synthesis and validation status, Git status, and blockers.
