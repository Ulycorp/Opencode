import { tool } from "@opencode-ai/plugin"
import { initializeProject, workspaceRootFromContext } from "../../internal/lib/workspace.mjs"

export default tool({
  description: "Initialize a schema-validated project atomically, refresh projects/_index.md, and return every exact created file for safe checkpointing.",
  args: {
    name: tool.schema.string().min(1).max(120).describe("Human-readable project name"),
    slug: tool.schema.string().optional().describe("Optional canonical lowercase slug"),
    description: tool.schema.string().optional().describe("Stable one-line project description"),
    domains: tool.schema.array(tool.schema.enum(["market", "marketing", "web", "mobile", "shopify", "legal"])).optional(),
  },
  async execute(args, context) {
    const root = await workspaceRootFromContext(context)
    return JSON.stringify(await initializeProject(root, args), null, 2)
  },
})
