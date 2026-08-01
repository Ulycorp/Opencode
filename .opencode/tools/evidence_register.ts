import { tool } from "@opencode-ai/plugin"
import { registerEvidence, workspaceRootFromContext } from "../../internal/lib/workspace.mjs"

export default tool({
  description: "Register a dated, classified evidence record without storing credentials or hidden reasoning.",
  args: {
    project: tool.schema.string().min(1),
    scope: tool.schema.enum(["market", "marketing", "web", "mobile", "shopify", "legal", "opportunity"]),
    url: tool.schema.string().url(),
    title: tool.schema.string().min(1),
    provider: tool.schema.string().min(1),
    checked_at: tool.schema.string().optional(),
    agent: tool.schema.string().min(1),
    claim: tool.schema.string().min(1),
    confidence: tool.schema.enum(["FACT", "SOURCE", "INFERENCE", "ESTIMATE", "UNKNOWN"]).optional(),
    source_type: tool.schema.enum(["official", "primary", "vendor", "study", "media", "community", "inference"]).optional(),
    retrieved_via: tool.schema.string().optional(),
    notes: tool.schema.string().optional(),
  },
  async execute(args, context) {
    const root = await workspaceRootFromContext(context)
    return JSON.stringify(await registerEvidence(root, args, context.agent), null, 2)
  },
})
