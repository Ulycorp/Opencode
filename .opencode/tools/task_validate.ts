import { tool } from "@opencode-ai/plugin"
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { agentMayWriteOutput, readProject, validateDelegation, workspaceRootFromContext } from "../../internal/lib/workspace.mjs"

export default tool({
  description: "Validate a task.v1 delegation contract and reject loops, vague objectives, path escapes or depth above four.",
  args: {
    schema: tool.schema.literal("task.v1"),
    task_id: tool.schema.string().uuid(),
    project_id: tool.schema.string().min(1),
    requested_by: tool.schema.string().min(1),
    target_agent: tool.schema.string().min(1),
    objective: tool.schema.string().min(12),
    expected_output: tool.schema.string().min(1),
    output_path: tool.schema.string().min(1),
    delegation_depth: tool.schema.number().int().min(0).max(4),
    visited_agents: tool.schema.array(tool.schema.string()),
    deadline_policy: tool.schema.enum(["best-effort", "hard-deadline", "none"]),
    deadline: tool.schema.string().nullable().optional(),
  },
  async execute(args, context) {
    if (args.requested_by !== context.agent) throw new Error(`requested_by must match the caller (${context.agent})`)
    const root = await workspaceRootFromContext(context)
    const files = await readdir(path.join(root, ".opencode", "agents"), { withFileTypes: true })
    const knownAgents = new Set(files.filter((entry) => entry.isFile() && entry.name.endsWith(".md")).map((entry) => entry.name.slice(0, -3)))
    const result = validateDelegation(args, knownAgents)
    if (!result.valid) throw new Error(`Invalid delegation: ${result.errors.join("; ")}`)
    const outputPath = args.output_path.replaceAll("\\", "/")
    if (outputPath.startsWith("dev/")) {
      const { project } = await readProject(root, args.project_id)
      const configuredRoots = ["web_path", "mobile_path", "shopify_path"]
        .map((key) => project.repositories?.[key])
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.replaceAll("\\", "/"))
      if (!configuredRoots.some((prefix) => outputPath === prefix || outputPath.startsWith(`${prefix}/`))) {
        throw new Error(`Development output must stay under a repository registered for ${args.project_id}`)
      }
    }
    const targetDefinition = await readFile(path.join(root, ".opencode", "agents", `${args.target_agent}.md`), "utf8")
    if (!agentMayWriteOutput(targetDefinition, args.output_path)) throw new Error(`Target agent ${args.target_agent} does not own output path ${args.output_path}`)
    return JSON.stringify({ valid: true, task_id: args.task_id }, null, 2)
  },
})
