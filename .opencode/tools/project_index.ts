import { tool } from "@opencode-ai/plugin"
import { updateProjectIndex, workspaceRootFromContext } from "../../internal/lib/workspace.mjs"

export default tool({
  description: "Regenerate the deterministic global projects/_index.md table from project.yaml files.",
  args: {},
  async execute(_args, context) {
    const root = await workspaceRootFromContext(context)
    return JSON.stringify(await updateProjectIndex(root), null, 2)
  },
})
