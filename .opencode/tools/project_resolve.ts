import { tool } from "@opencode-ai/plugin"
import { resolveProject, workspaceRootFromContext } from "../../internal/lib/workspace.mjs"

export default tool({
  description: "Resolve a project name or slug to its canonical id, path, status and domains.",
  args: {
    query: tool.schema.string().min(1).describe("Project name or canonical slug"),
  },
  async execute(args, context) {
    const root = await workspaceRootFromContext(context)
    return JSON.stringify(await resolveProject(root, args.query), null, 2)
  },
})
