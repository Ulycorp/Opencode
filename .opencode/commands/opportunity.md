---
description: Recherche des opportunités actuelles et vérifiées pour un projet existant
agent: global-orchestrator
---

Research project opportunities from: `$ARGUMENTS`.

Expect a project identifier plus an optional category, geography, eligibility constraint, or time horizon. As `global-orchestrator`, load `workspace-routing`, `project-context`, `task-delegation`, `report-contract`, `evidence-policy`, `untrusted-content-policy`, and `git-workflow`. Require `opportunity-researcher` to load `source-quality` and its domain skills.

## Context and scope

1. Call `project_resolve`; stop if the project is missing or ambiguous.
2. Read `project.yaml`, `CONTEXT.md`, `market-research/synthesis.md`, and available core market reports in that order.
3. Do not rerun the three core market studies merely because a report is absent. Continue with explicit limitations or ask for missing business constraints when they materially change eligibility.
4. Normalize the requested category to one of `funding`, `grants`, `events`, `partnerships`, or `other`; choose the closest safe category and state the mapping.
5. Derive a dated output such as `projects/<slug>/opportunities/<category>/<YYYY-MM-DD>-<topic>.md`. Never overwrite an unrelated prior opportunity report.

Delegate through `market-orchestrator` to exactly one `opportunity-researcher` task. Its complete `task.v1` contract must contain a UUID `task_id`, `project_id`, `requested_by`, target agent, the bounded category/geography/time objective, exact expected output and path, `delegation_depth`, `visited_agents`, and deadline policy. Call `task_validate` before dispatch. Do not launch SEO, e-commerce, advertising, persona, creative, IT, or legal specialists unless a separate workflow is explicitly requested.

The opportunity report must, for every candidate, include name, issuing organization, official URL, country/region, verified deadline or explicit rolling status, eligibility, relevance, score with rationale, required next actions, and uncertainty/risk. Deadlines, open/closed status, and conditions must be checked during this run against an official primary source whenever available. Never present an expired, unverified, or inferred deadline as current fact.

Call `evidence_register` with `scope: "opportunity"` for every material official source and retain every exact path it returns. Label FACT, SOURCE, INFERENCE, ESTIMATE, and UNKNOWN, record `sources_checked_at`, and document unavailable providers and authorized fallbacks.

## Validate and persist

1. Call `report_validate` on the exact output. Return it once to `opportunity-researcher` for bounded correction if invalid; otherwise mark the workflow blocked.
2. Have the consolidating orchestrator update `STATUS.md` with the report path, check date, and follow-up deadlines. Update `project.yaml` only if its schema contains a relevant field; never invent schema keys.
3. Call `project_index` only if a project status represented in the index changed.
4. Build `checkpoint_paths` from the exact opportunity report, every returned evidence path, and only changed `project.yaml`, `STATUS.md`, `DECISIONS.md`, or `projects/_index.md`.
5. Add `projects/<slug>/logs/runs/<timestamp>-opportunity.md` to `checkpoint_paths`, then finalize the log with query scope, agent, output, validation, freshness, errors, and the planned request `{ scope: opportunity, paths: checkpoint_paths, message: research(opportunity): add <topic> opportunities for <slug>, push: true, rebase: false }`. Exclude secrets, chain-of-thought, and a future commit hash.
6. Call `git_checkpoint` with `{ project: "<slug>", scope: "opportunity", paths: checkpoint_paths, message: "research(opportunity): add <topic> opportunities for <slug>", push: true, rebase: false }`. Paths must be exact files returned or modified by this workflow.

Git operations must stay on an authorized branch, preserve unrelated changes, fetch before a safe push, stop on divergence or conflict, and never force-push, reset, clean, or rewrite history. Do not rewrite the finalized run log after the call; return the actual checkpoint result to the user. If Git or credentials are unavailable, preserve the report and state that it was not committed or pushed.

Return the output path, number of current candidates, deadlines requiring action, validation result, source check date, Git status, and blockers.
