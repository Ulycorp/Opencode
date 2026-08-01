import { readFile, readdir, stat } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import Ajv2020 from "ajv/dist/2020.js"
import addFormats from "ajv-formats"
import { parse as parseYaml } from "yaml"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const errors = []
const warnings = []

const sol = [
  "global-orchestrator", "it-orchestrator", "business-orchestrator", "web-orchestrator",
  "mobile-orchestrator", "shopify-orchestrator", "market-orchestrator", "marketing-orchestrator",
]
const terra = [
  "web-architect", "web-frontend", "web-backend", "web-data", "web-security", "web-devops-release",
  "mobile-architect", "mobile-ui", "mobile-native-ios", "mobile-native-android", "mobile-data-sync", "mobile-security",
  "shopify-architect", "shopify-reference-analyzer", "shopify-theme", "shopify-app-extension", "shopify-security",
  "seo-geo-researcher", "ecommerce-intelligence", "advertising-intelligence", "opportunity-researcher",
  "persona-strategist", "creative-producer", "legal-auditor",
]
const luna = [
  "web-qa", "web-performance-a11y", "mobile-qa", "mobile-release",
  "shopify-data-catalog", "shopify-qa", "shopify-release",
]
const orchestratorAgents = new Set([
  "global-orchestrator", "it-orchestrator", "business-orchestrator", "web-orchestrator",
  "mobile-orchestrator", "shopify-orchestrator", "market-orchestrator", "marketing-orchestrator",
])

const expectedAgentModels = new Map([
  ...sol.map((name) => [name, "openai/gpt-5.6-sol"]),
  ...terra.map((name) => [name, "openai/gpt-5.6-terra"]),
  ...luna.map((name) => [name, "openai/gpt-5.6-luna"]),
])

const expectedCommands = ["projet", "market", "opportunity", "marketing", "build-web", "build-mobile", "build-shopify", "audit", "status", "sync"]
const expectedTools = ["project_init", "project_resolve", "project_status", "project_index", "report_validate", "evidence_register", "task_validate", "git_checkpoint"]
const expectedMcp = ["context7", "playwright", "semrush", "trendtrack", "higgsfield", "fr_legal"]
const expectedSkills = [
  "workspace-routing", "project-context", "task-delegation", "cross-domain-planning", "software-delivery",
  "architecture-decision-records", "repo-analysis", "git-workflow", "testing-strategy", "security-gate", "release-gate",
  "report-contract", "evidence-policy", "source-quality", "secret-handling", "untrusted-content-policy",
  "web-architecture", "api-contracts", "domain-modeling", "dependency-review", "frontend-engineering", "react-next",
  "responsive-ui", "design-system", "frontend-testing", "accessibility", "visual-regression", "backend-engineering",
  "api-design", "auth-security", "error-handling", "integration-patterns", "observability", "testing-backend",
  "backend-testing", "data-modeling", "sql-migrations", "database-performance", "data-security", "migration-safety",
  "owasp-web-review", "threat-model", "dependency-security", "secrets-review", "authz-review", "quality-gate-web",
  "web-performance", "release-web",
  "mobile-architecture", "react-native-expo", "ios-native", "android-native", "mobile-offline", "mobile-navigation",
  "mobile-security-masvs", "mobile-testing", "maestro-e2e", "eas-build", "eas-submit", "mobile-release",
  "shopify-architecture", "shopify-reference-reconstruction", "shopify-liquid", "shopify-theme-architecture",
  "shopify-sections", "shopify-accessibility", "shopify-performance", "shopify-admin-api", "shopify-functions",
  "shopify-metafields", "shopify-catalog", "shopify-cli", "shopify-theme-check", "shopify-release",
  "keyword-research", "seo-clustering", "geo-optimization", "competitor-analysis", "ecommerce-intelligence",
  "ad-intelligence", "market-synthesis", "opportunity-research",
  "persona-strategy", "positioning", "offer-design", "creative-brief", "copywriting", "ugc-script",
  "creative-iteration", "seo-marketing", "campaign-analysis",
  "legal-source-research-fr", "legifrance-research", "bofip-research", "privacy-audit", "ecommerce-compliance",
  "mobile-compliance", "web-compliance", "legal-report",
]

function check(condition, message) {
  if (!condition) errors.push(message)
}

function wildcardMatches(pattern, value) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replaceAll("*", ".*")
  return new RegExp(`^${escaped}$`).test(value)
}

async function exists(relative) {
  try { await stat(path.join(ROOT, relative)); return true } catch { return false }
}

async function read(relative) {
  return readFile(path.join(ROOT, relative), "utf8")
}

function parseFrontmatter(content, label) {
  const match = content.replace(/^\uFEFF/, "").match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) {
    errors.push(`${label}: missing or unclosed YAML frontmatter`)
    return { frontmatter: {}, body: content }
  }
  try {
    return { frontmatter: parseYaml(match[1]) || {}, body: match[2] }
  } catch (error) {
    errors.push(`${label}: invalid YAML frontmatter (${error.message})`)
    return { frontmatter: {}, body: match[2] }
  }
}

async function validateRoot() {
  for (const file of ["opencode.json", "AGENTS.md", "README.md", ".gitignore", ".env.example", "workspace.yaml", "package.json", "projects/_index.md"]) {
    check(await exists(file), `missing root artifact: ${file}`)
  }
  const config = JSON.parse(await read("opencode.json"))
  check(config.$schema === "https://opencode.ai/config.json", "opencode.json: wrong schema URL")
  check(config.default_agent === "global-orchestrator", "opencode.json: default_agent must be global-orchestrator")
  check(config.subagent_depth === 4, "opencode.json: subagent_depth must be 4")
  check(config.model === "openai/gpt-5.6-sol", "opencode.json: default model must be OpenAI GPT-5.6 Sol")
  check(config.small_model === "openai/gpt-5.6-luna", "opencode.json: small_model must be OpenAI GPT-5.6 Luna")
  check(config.autoupdate === false, "opencode.json: autoupdate must be false for the pinned runtime")
  check(config.share === "disabled", "opencode.json: sharing must be disabled")
  check(config.permission?.external_directory === "deny", "opencode.json: external_directory must be denied globally")
  check(config.permission?.bash?.["git push --force*"] === "deny", "opencode.json: force-push must be denied")
  check(config.permission?.bash?.["git reset --hard*"] === "deny", "opencode.json: reset --hard must be denied")
  check(JSON.stringify(Object.keys(config.mcp || {}).sort()) === JSON.stringify([...expectedMcp].sort()), "opencode.json: MCP catalogue differs from expected snake_case IDs")
  check(config.mcp?.semrush?.url === "https://mcp.semrush.com/v2/mcp", "opencode.json: Semrush endpoint mismatch")
  check(config.mcp?.trendtrack?.url === "https://api.trendtrack.io/v1/mcp", "opencode.json: TrendTrack endpoint mismatch")
  check(config.mcp?.higgsfield?.url === "https://mcp.higgsfield.ai/mcp", "opencode.json: Higgsfield endpoint mismatch")

  const versions = parseYaml(await read("workspace.yaml"))
  check(versions.workspace_version === "1.0.0", "workspace.yaml: workspace_version mismatch")
  check(versions.opencode_version === "1.18.10", "workspace.yaml: opencode_version must be 1.18.10")
  const pkg = JSON.parse(await read("package.json"))
  check(pkg.devDependencies?.["opencode-ai"] === "1.18.10", "package.json: opencode-ai must be pinned exactly to 1.18.10")
  check(pkg.dependencies?.["@opencode-ai/plugin"] === "1.18.10", "package.json: @opencode-ai/plugin must match OpenCode 1.18.10")

  const envLines = (await read(".env.example")).split(/\r?\n/).filter((line) => /^[A-Z][A-Z0-9_]*=/.test(line))
  for (const line of envLines) {
    const [key, ...parts] = line.split("=")
    const value = parts.join("=")
    if (/(?:TOKEN|KEY|SECRET|PASSWORD|CLIENT_ID)$/.test(key)) check(value === "", `.env.example: ${key} must have no value`)
  }
  const gitignore = await read(".gitignore")
  check(!/marketing\/creatives\/generated\/\*/.test(gitignore), ".gitignore: generated creative assets must remain versionable with metadata")
}

async function validateAgents() {
  const directory = path.join(ROOT, ".opencode", "agents")
  const entries = await readdir(directory, { withFileTypes: true })
  const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
  const subdirectories = entries.filter((entry) => entry.isDirectory())
  check(subdirectories.length === 0, `.opencode/agents must be flat; found directories: ${subdirectories.map((entry) => entry.name).join(", ")}`)
  check(files.length === 39, `expected 39 flat agent files, found ${files.length}`)
  const names = new Set(files.map((file) => file.name.slice(0, -3)))
  for (const expected of expectedAgentModels.keys()) check(names.has(expected), `missing agent: ${expected}`)
  for (const actual of names) check(expectedAgentModels.has(actual), `unexpected agent: ${actual}`)

  let primaryCount = 0
  const skillNames = new Set(expectedSkills)
  for (const file of files) {
    const name = file.name.slice(0, -3)
    const content = await readFile(path.join(directory, file.name), "utf8")
    const { frontmatter, body } = parseFrontmatter(content, `agent ${name}`)
    check(typeof frontmatter.description === "string" && frontmatter.description.length >= 20, `agent ${name}: description is missing or vague`)
    check(frontmatter.model === expectedAgentModels.get(name), `agent ${name}: expected model ${expectedAgentModels.get(name)}, got ${frontmatter.model}`)
    const expectedMode = orchestratorAgents.has(name) ? "primary" : "subagent"
    check(frontmatter.mode === expectedMode, `agent ${name}: mode must be ${expectedMode}`)
    if (frontmatter.mode === "primary") primaryCount += 1
    check(frontmatter.permission?.["*"] === "deny", `agent ${name}: permission catch-all must deny`)
    check(frontmatter.permission?.external_directory === "deny", `agent ${name}: external_directory must be denied`)
    check(frontmatter.permission?.task && typeof frontmatter.permission.task === "object", `agent ${name}: granular task permission is required`)
    check(frontmatter.permission?.task?.[name] === "deny", `agent ${name}: self-delegation must be denied explicitly`)
    const skillPermission = frontmatter.permission?.skill
    check(skillPermission && typeof skillPermission === "object", `agent ${name}: granular skill permission is required`)
    for (const [skill, action] of Object.entries(skillPermission || {})) {
      if (skill !== "*" && action === "allow") {
        const resolves = skill.includes("*")
          ? [...skillNames].some((knownSkill) => wildcardMatches(skill, knownSkill))
          : skillNames.has(skill)
        check(resolves, `agent ${name}: references missing skill or unmatched pattern ${skill}`)
      }
    }
    check(frontmatter.permission?.task_validate === "allow", `agent ${name}: task_validate must be explicitly allowed`)
    if (name !== "global-orchestrator") check(frontmatter.permission?.["project_*"] !== "allow", `agent ${name}: broad project_* mutation permission is forbidden`)
    check(frontmatter.permission?.["higgsfield_*"] !== "allow", `agent ${name}: broad Higgsfield allow bypasses cost gates`)
    for (const required of ["task_id", "project_id", "requested_by", "expected_output", "output_path", "delegation_depth", "visited_agents", "deadline_policy"]) {
      check(body.includes(required), `agent ${name}: delegation contract omits ${required}`)
    }
    check(/profondeur|depth/i.test(body) && body.includes("4"), `agent ${name}: depth-4 guard is absent`)
    check(/critères? de fin|criteria/i.test(body), `agent ${name}: completion criteria section is absent`)
    const bashPermission = frontmatter.permission?.bash
    const forcePushDenied = bashPermission === "deny" || bashPermission?.["*"] === "deny" || bashPermission?.["git push --force*"] === "deny"
    check(forcePushDenied || /force[- ]?push|push forc|Git destructif|mutation Git destructive/i.test(body), `agent ${name}: destructive Git guard is absent`)
  }
  check(primaryCount === orchestratorAgents.size, `expected ${orchestratorAgents.size} primary agents, found ${primaryCount}`)

  const global = parseFrontmatter(await read(".opencode/agents/global-orchestrator.md"), "agent global-orchestrator").frontmatter
  check(global.permission?.skill?.["*"] === "allow", "global-orchestrator: slash-command skills must be loadable")

  const legal = parseFrontmatter(await read(".opencode/agents/legal-auditor.md"), "agent legal-auditor").frontmatter
  const legalEdit = legal.permission?.edit
  check(legalEdit?.["*"] === "deny", "legal-auditor: edits must deny by default")
  check(Object.entries(legalEdit || {}).some(([pattern, action]) => pattern.includes("/legal/") && action === "allow"), "legal-auditor: no legal-only edit allow rule")
  check(legal.permission?.["fr_legal_*"] === "allow", "legal-auditor: fr_legal MCP tools must be allowed")
  check(legal.permission?.bash === "deny" || legal.permission?.bash?.["*"] === "deny", "legal-auditor: shell must deny by default")
}

async function validateCommands() {
  const directory = path.join(ROOT, ".opencode", "commands")
  const files = (await readdir(directory)).filter((file) => file.endsWith(".md"))
  check(files.length === expectedCommands.length, `expected ${expectedCommands.length} commands, found ${files.length}`)
  for (const name of expectedCommands) {
    check(files.includes(`${name}.md`), `missing command: ${name}`)
    if (!files.includes(`${name}.md`)) continue
    const { frontmatter, body } = parseFrontmatter(await readFile(path.join(directory, `${name}.md`), "utf8"), `command ${name}`)
    check(frontmatter.agent === "global-orchestrator", `command ${name}: agent must be global-orchestrator`)
    check(typeof frontmatter.description === "string" && frontmatter.description.length >= 10, `command ${name}: description missing`)
    check(body.includes("$ARGUMENTS"), `command ${name}: $ARGUMENTS placeholder missing`)
    if (name === "status") {
      check(/read-only|lecture seule/i.test(body) && body.includes("/sync"), "command status: must remain read-only and route mutations to /sync")
    } else {
      check(/git_checkpoint/.test(body), `command ${name}: Git checkpoint policy missing`)
    }
  }
  const projectCommand = await read(".opencode/commands/projet.md")
  for (const agent of ["seo-geo-researcher", "ecommerce-intelligence", "advertising-intelligence"]) check(projectCommand.includes(agent), `/projet omits ${agent}`)
  check(/Do NOT invoke[\s\S]*opportunity-researcher/i.test(projectCommand), "/projet must explicitly prohibit opportunity-researcher")
  check(/concurrent|parallel/i.test(projectCommand), "/projet must require concurrent initial research")
}

async function validateSkills() {
  const root = path.join(ROOT, ".opencode", "skills")
  const entries = await readdir(root, { withFileTypes: true })
  const actual = new Set(entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name))
  for (const name of expectedSkills) check(actual.has(name), `missing skill: ${name}`)
  for (const name of actual) {
    const file = path.join(root, name, "SKILL.md")
    check(await exists(path.relative(ROOT, file)), `skill ${name}: SKILL.md missing`)
    if (!(await exists(path.relative(ROOT, file)))) continue
    const content = await readFile(file, "utf8")
    const { frontmatter, body } = parseFrontmatter(content, `skill ${name}`)
    check(frontmatter.name === name, `skill ${name}: frontmatter name mismatch`)
    check(typeof frontmatter.description === "string" && frontmatter.description.length >= 10 && frontmatter.description.length <= 1024, `skill ${name}: invalid description`)
    check(String(frontmatter.compatibility || "").includes("opencode"), `skill ${name}: compatibility must name OpenCode`)
    check(body.trim().length >= 150, `skill ${name}: instructions are too thin`)
    check(!/(?:openai|anthropic|claude|gemini)\/[a-z0-9._-]+/i.test(body), `skill ${name}: skills must not pin an LLM provider/model`)
  }
  const alias = await read(".opencode/skills/testing-backend/SKILL.md")
  check(alias.includes("backend-testing"), "testing-backend must explicitly alias/cross-reference backend-testing")
}

async function validateToolsAndSchemas() {
  const toolsDirectory = path.join(ROOT, ".opencode", "tools")
  const toolFiles = (await readdir(toolsDirectory)).filter((file) => file.endsWith(".ts"))
  for (const toolName of expectedTools) check(toolFiles.includes(`${toolName}.ts`), `missing custom tool: ${toolName}`)
  for (const file of toolFiles) {
    const content = await readFile(path.join(toolsDirectory, file), "utf8")
    check(content.includes('from "@opencode-ai/plugin"'), `tool ${file}: must use @opencode-ai/plugin helper`)
    check(content.includes("export default tool("), `tool ${file}: must default-export tool()`)
  }
  const gitTool = await read(".opencode/tools/git_checkpoint.ts")
  check(gitTool.includes("paths:") && gitTool.includes("context.agent"), "git_checkpoint: explicit paths and caller identity are required")
  const evidenceTool = await read(".opencode/tools/evidence_register.ts")
  check(evidenceTool.includes("scope:") && evidenceTool.includes("context.agent"), "evidence_register: scope and caller-bound provenance are required")
  const taskTool = await read(".opencode/tools/task_validate.ts")
  check(taskTool.includes("knownAgents") && taskTool.includes("context.agent"), "task_validate: known-agent registry and caller identity are required")
  const ajv = new Ajv2020({ strict: false, allErrors: true })
  addFormats(ajv)
  for (const schemaName of ["project", "report", "evidence", "task", "creative-metadata"]) {
    const relative = `schemas/${schemaName}.schema.json`
    check(await exists(relative), `missing schema: ${relative}`)
    if (!(await exists(relative))) continue
    try { ajv.compile(JSON.parse(await read(relative))) } catch (error) { errors.push(`${relative}: invalid JSON Schema (${error.message})`) }
  }
  for (const file of [
    "internal/mcp/fr-legal/src/server.ts", "internal/mcp/fr-legal/src/auth/piste.ts",
    "internal/mcp/fr-legal/src/providers/legifrance.ts", "internal/mcp/fr-legal/src/providers/bofip.ts",
    "internal/mcp/fr-legal/src/providers/cnil.ts", "internal/mcp/fr-legal/README.md",
  ]) check(await exists(file), `missing fr-legal component: ${file}`)
  const server = await read("internal/mcp/fr-legal/src/tools/register.ts")
  for (const name of [
    "frlegal_search_law", "frlegal_get_article", "frlegal_get_code", "frlegal_search_jurisprudence", "frlegal_get_document",
    "frlegal_bofip_search", "frlegal_bofip_get", "frlegal_bofip_recent", "frlegal_cnil_search", "frlegal_cnil_get_guidance",
  ]) check(server.includes(`\"${name}\"`), `fr-legal: missing MCP tool ${name}`)
}

async function validateTemplatesAndSecrets() {
  const requiredTemplates = [
    "templates/project/directories.txt", "templates/project/project.yaml", "templates/project/README.md",
    "templates/project/CONTEXT.md", "templates/project/DECISIONS.md", "templates/project/STATUS.md",
    "templates/reports/report.md", "templates/prompts/delegation.md", "templates/logs/run.md", "templates/creative/metadata.yaml",
  ]
  for (const file of requiredTemplates) check(await exists(file), `missing template: ${file}`)
  const directories = new Set((await read("templates/project/directories.txt")).split(/\r?\n/).filter(Boolean))
  for (const required of ["market-research/evidence", "marketing/evidence", "marketing/creatives/generated", "legal/audits", "legal/evidence", "opportunities/funding", "opportunities/evidence", "shared/sources", "logs/runs"]) {
    check(directories.has(required), `project template directory missing: ${required}`)
  }
  for (const forbidden of ["it/web", "it/mobile", "it/shopify"]) check(![...directories].some((directory) => directory === forbidden || directory.startsWith(`${forbidden}/`)), `business project template must not create ${forbidden}`)

  const scanRoots = [".opencode", "internal", "schemas", "templates", "AGENTS.md", "opencode.json"]
  const tokenPatterns = [
    /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
    /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  ]
  async function scan(target) {
    const details = await stat(target)
    if (details.isDirectory()) {
      for (const entry of await readdir(target)) await scan(path.join(target, entry))
      return
    }
    if (!/\.(?:md|json|ya?ml|mjs|ts)$/.test(target)) return
    const content = await readFile(target, "utf8")
    if (tokenPatterns.some((pattern) => pattern.test(content))) errors.push(`possible committed secret: ${path.relative(ROOT, target)}`)
  }
  for (const item of scanRoots) await scan(path.join(ROOT, item))
}

async function main() {
  await validateRoot()
  await validateAgents()
  await validateCommands()
  await validateSkills()
  await validateToolsAndSchemas()
  await validateTemplatesAndSecrets()
  if (warnings.length) console.warn(warnings.map((item) => `WARN: ${item}`).join("\n"))
  if (errors.length) {
    console.error(`Workspace validation failed with ${errors.length} error(s):`)
    console.error(errors.map((item) => `- ${item}`).join("\n"))
    process.exitCode = 1
    return
  }
  console.log(`Workspace validation passed: ${expectedAgentModels.size} agents, ${expectedCommands.length} commands, ${expectedSkills.length} required skills, ${expectedTools.length} custom tools, ${expectedMcp.length} MCP servers.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
