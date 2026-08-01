import { tool } from "@opencode-ai/plugin"
import { validateReportFile, workspaceRootFromContext } from "../../internal/lib/workspace.mjs"

export default tool({
  description: "Validate a report.v1 Markdown file, its frontmatter, required sections, sources, date and project path.",
  args: {
    path: tool.schema.string().min(1).describe("Workspace-relative Markdown report path under projects/"),
    project: tool.schema.string().optional().describe("Expected canonical project slug"),
  },
  async execute(args, context) {
    const root = await workspaceRootFromContext(context)
    const result = await validateReportFile(root, args.path, args.project)
    if (!result.valid) throw new Error(`Invalid report: ${result.errors.join("; ")}`)
    return JSON.stringify(result, null, 2)
  },
})
