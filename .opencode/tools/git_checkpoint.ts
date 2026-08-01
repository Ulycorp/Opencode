import { tool } from "@opencode-ai/plugin"
import { gitCheckpoint, workspaceRootFromContext } from "../../internal/lib/workspace.mjs"

export default tool({
  description: "Commit only explicitly listed workflow-owned paths after actor, scope, staging, secret, branch and divergence checks.",
  args: {
    project: tool.schema.string().min(1).describe("Canonical project slug"),
    scope: tool.schema.enum(["project", "market", "marketing", "web", "mobile", "shopify", "legal", "opportunity", "status"]),
    paths: tool.schema.array(tool.schema.string().min(1)).min(1).describe("Exact changed files, or a newly initialized project directory, owned by this workflow"),
    message: tool.schema.string().min(1).describe("Conventional Commit message"),
    push: tool.schema.boolean().optional().describe("Push the authorized project branch after fetching and divergence checks"),
    rebase: tool.schema.boolean().optional().describe("Allow a safe upstream rebase; reserved to global-orchestrator and /sync"),
  },
  async execute(args, context) {
    const root = await workspaceRootFromContext(context)
    return JSON.stringify(await gitCheckpoint(root, args, context.agent), null, 2)
  },
})
