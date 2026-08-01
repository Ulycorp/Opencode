import { tool } from "@opencode-ai/plugin"
import { getProjectStatus, resolveProject, workspaceRootFromContext } from "../../internal/lib/workspace.mjs"

export default tool({
  description: "Return a concise machine-readable project status and the latest materialized reports.",
  args: {
    project: tool.schema.string().min(1).describe("Project name or slug"),
  },
  async execute(args, context) {
    const root = await workspaceRootFromContext(context)
    const resolved = await resolveProject(root, args.project)
    return JSON.stringify(await getProjectStatus(root, resolved.id), null, 2)
  },
})
