---
schema: "task.v1"
task_id: "{{TASK_ID}}"
project_id: "{{PROJECT}}"
requested_by: "{{REQUESTED_BY}}"
target_agent: "{{TARGET_AGENT}}"
objective: "{{OBJECTIVE}}"
expected_output: "{{EXPECTED_OUTPUT}}"
output_path: "{{OUTPUT_PATH}}"
delegation_depth: {{DELEGATION_DEPTH}}
visited_agents: {{VISITED_AGENTS_JSON}}
deadline_policy: "best-effort"
deadline: null
---

Retourner un résultat ciblé au demandeur. Ne pas déléguer à un agent présent dans `visited_agents` et ne pas dépasser la profondeur 4.
