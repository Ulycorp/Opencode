import { randomUUID } from "node:crypto"
import { execFile } from "node:child_process"
import { access, mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { promisify } from "node:util"
import Ajv2020 from "ajv/dist/2020.js"
import addFormats from "ajv-formats"
import { parse as parseYaml, stringify as stringifyYaml } from "yaml"

const execFileAsync = promisify(execFile)

export const WORKSPACE_VERSION = "1.0.0"
export const PROJECT_SCHEMA_VERSION = "project.v1"
export const REPORT_SCHEMA_VERSION = "report.v1"
export const MAX_DELEGATION_DEPTH = 4

const PROJECT_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const AGENT_ID = PROJECT_SLUG
const schemaValidators = new Map()
const EVIDENCE_DIRECTORIES = {
  market: "market-research/evidence",
  marketing: "marketing/evidence",
  legal: "legal/evidence",
  opportunity: "opportunities/evidence",
}
const EVIDENCE_ACTOR_SCOPES = {
  "global-orchestrator": Object.keys(EVIDENCE_DIRECTORIES),
  "business-orchestrator": ["market", "marketing", "opportunity"],
  "it-orchestrator": ["web", "mobile", "shopify"],
  "market-orchestrator": ["market"],
  "marketing-orchestrator": ["marketing"],
  "seo-geo-researcher": ["market"],
  "ecommerce-intelligence": ["market"],
  "advertising-intelligence": ["market"],
  "opportunity-researcher": ["opportunity"],
  "persona-strategist": ["marketing"],
  "web-security": ["web"],
  "mobile-security": ["mobile"],
  "shopify-reference-analyzer": ["shopify"],
  "shopify-security": ["shopify"],
  "legal-auditor": ["legal"],
}
const REPORT_SECTIONS = [
  "Résumé exécutif",
  "Objectif",
  "Méthodologie",
  "Données / observations",
  "Analyse",
  "Recommandations",
  "Limites",
  "Sources",
]

export async function pathExists(target) {
  try {
    await access(target)
    return true
  } catch {
    return false
  }
}

export async function findWorkspaceRoot(startDirectory) {
  let current = path.resolve(startDirectory)
  while (true) {
    if (await pathExists(path.join(current, "opencode.json"))) return current
    const parent = path.dirname(current)
    if (parent === current) break
    current = parent
  }
  throw new Error(`Workspace root not found from ${startDirectory}`)
}

export async function workspaceRootFromContext(context = {}) {
  const candidate = context.worktree || context.directory || process.cwd()
  return findWorkspaceRoot(candidate)
}

export function assertSafeSlug(slug) {
  if (typeof slug !== "string" || !PROJECT_SLUG.test(slug) || slug.length > 80 || slug === "_index") {
    throw new Error("Invalid project slug; expected lowercase letters/digits separated by single hyphens")
  }
  return slug
}

export function slugifyProjectName(name) {
  if (typeof name !== "string" || !name.trim() || name.trim().length > 120) {
    throw new Error("Project name must contain between 1 and 120 characters")
  }
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
  return assertSafeSlug(slug)
}

export function safeResolve(base, ...segments) {
  const resolvedBase = path.resolve(base)
  const target = path.resolve(resolvedBase, ...segments)
  if (target !== resolvedBase && !target.startsWith(`${resolvedBase}${path.sep}`)) {
    throw new Error(`Path escapes allowed root: ${target}`)
  }
  return target
}

export function globMatches(pattern, value) {
  let source = ""
  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index]
    if (character === "*" && pattern[index + 1] === "*") { source += ".*"; index += 1 }
    else if (character === "*") source += "[^/]*"
    else source += /[.+?^${}()|[\]\\]/.test(character) ? `\\${character}` : character
  }
  return new RegExp(`^${source}$`).test(value)
}

export function agentMayWriteOutput(content, outputPath) {
  const match = content.replace(/^\uFEFF/, "").match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return false
  const edit = parseYaml(match[1])?.permission?.edit
  if (typeof edit === "string") return edit === "allow"
  let decision = "deny"
  for (const [pattern, action] of Object.entries(edit || {})) if (globMatches(pattern, outputPath)) decision = String(action)
  return decision === "allow"
}

export function projectDirectory(root, slug) {
  return safeResolve(path.join(root, "projects"), assertSafeSlug(slug))
}

export async function readYamlFile(file) {
  return parseYaml(await readFile(file, "utf8"))
}

async function schemaValidator(root, schemaName) {
  const key = `${path.resolve(root)}:${schemaName}`
  if (schemaValidators.has(key)) return schemaValidators.get(key)
  const ajv = new Ajv2020({ strict: false, allErrors: true })
  addFormats(ajv)
  const schema = JSON.parse(await readFile(path.join(root, "schemas", `${schemaName}.schema.json`), "utf8"))
  const validator = ajv.compile(schema)
  schemaValidators.set(key, validator)
  return validator
}

function formatSchemaErrors(errors = []) {
  return errors.map((error) => `${error.instancePath || "/"} ${error.message}`).join("; ")
}

async function assertSchema(root, schemaName, value) {
  const validator = await schemaValidator(root, schemaName)
  if (!validator(value)) throw new Error(`${schemaName} schema validation failed: ${formatSchemaErrors(validator.errors)}`)
}

function assertProjectIdentity(project, slug, file) {
  if (project?.id !== slug) throw new Error(`Project identity mismatch in ${file}`)
  const businessPath = String(project.repositories?.business_path || "").replaceAll("\\", "/")
  const expectedBusinessRoot = `projects/${slug}`
  if (businessPath !== expectedBusinessRoot) throw new Error(`repositories.business_path must equal ${expectedBusinessRoot}`)
  for (const domain of ["web", "mobile", "shopify"]) {
    const configuredPath = project.repositories?.[`${domain}_path`]
    if (configuredPath === null) continue
    const localPath = String(configuredPath || "").replaceAll("\\", "/")
    const expectedRoot = `dev/${slug}/${domain}`
    if (localPath !== expectedRoot && !localPath.startsWith(`${expectedRoot}/`)) {
      throw new Error(`repositories.${domain}_path must stay under ${expectedRoot}`)
    }
  }
}

export async function readProject(root, slug) {
  const directory = projectDirectory(root, slug)
  const file = path.join(directory, "project.yaml")
  if (!(await pathExists(file))) throw new Error(`Unknown project: ${slug}`)
  const project = await readYamlFile(file)
  await assertSchema(root, "project", project)
  assertProjectIdentity(project, slug, file)
  return { directory, file, project }
}

function render(template, replacements) {
  return Object.entries(replacements).reduce(
    (value, [key, replacement]) => value.replaceAll(`{{${key}}}`, String(replacement)),
    template,
  )
}

async function loadTemplate(root, relativePath) {
  return readFile(path.join(root, "templates", relativePath), "utf8")
}

export async function listProjects(root) {
  const projectsRoot = path.join(root, "projects")
  if (!(await pathExists(projectsRoot))) return []
  const entries = await readdir(projectsRoot, { withFileTypes: true })
  const projects = []
  for (const entry of entries) {
    if (!entry.isDirectory() || !PROJECT_SLUG.test(entry.name)) continue
    try {
      const { project } = await readProject(root, entry.name)
      projects.push(project)
    } catch (error) {
      throw new Error(`Invalid project directory ${entry.name}: ${error.message}`)
    }
  }
  return projects.sort((a, b) => a.id.localeCompare(b.id, "en"))
}

function domainStatus(value) {
  if (typeof value === "string") return value
  return value?.status || "n/a"
}

export async function updateProjectIndex(root) {
  const projects = await listProjects(root)
  const lines = [
    "# Projects",
    "",
    "| Projet | Statut | Market | Marketing | Web | Mobile | Shopify | Legal |",
    "|---|---|---|---|---|---|---|---|",
    ...projects.map((project) =>
      `| [${String(project.name).replaceAll("|", "\\|")}](./${project.id}/README.md) | ${domainStatus(project.status)} | ${domainStatus(project.market)} | ${domainStatus(project.marketing)} | ${domainStatus(project.it?.web)} | ${domainStatus(project.it?.mobile)} | ${domainStatus(project.it?.shopify)} | ${domainStatus(project.legal)} |`,
    ),
    "",
    "_Index généré par `project_index`._",
    "",
  ]
  const target = path.join(root, "projects", "_index.md")
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, lines.join("\n"), "utf8")
  return { path: path.relative(root, target).replaceAll(path.sep, "/"), count: projects.length }
}

export async function initializeProject(root, input) {
  const name = String(input.name || "").trim()
  const slug = input.slug ? assertSafeSlug(String(input.slug)) : slugifyProjectName(name)
  const description = String(input.description || "Projet initialisé; contexte à compléter.").trim()
  const allowedDomains = new Set(["market", "marketing", "web", "mobile", "shopify", "legal"])
  const domains = [...new Set((input.domains?.length ? input.domains : ["market"]).map(String))]
  if (domains.some((domain) => !allowedDomains.has(domain))) throw new Error("Unsupported project domain")

  const projectsRoot = path.join(root, "projects")
  const destination = projectDirectory(root, slug)
  const destinationExists = await pathExists(destination)
  if (destinationExists && (await readdir(destination)).length > 0) throw new Error(`Project directory already contains files: ${slug}`)

  await mkdir(projectsRoot, { recursive: true })
  const temporary = safeResolve(projectsRoot, `.tmp-${slug}-${randomUUID()}`)
  const createdAt = new Date().toISOString()
  const replacements = {
    WORKSPACE_VERSION,
    SLUG: slug,
    NAME: name,
    DESCRIPTION: description,
    YAML_NAME: JSON.stringify(name).slice(1, -1),
    YAML_DESCRIPTION: JSON.stringify(description).slice(1, -1),
    CREATED_AT: createdAt,
    CREATED_DATE: createdAt.slice(0, 10),
    DOMAINS_JSON: JSON.stringify(domains),
  }

  let moved = false
  try {
    await mkdir(temporary, { recursive: false })
    const directories = (await loadTemplate(root, "project/directories.txt"))
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
    for (const relative of directories) {
      const directory = safeResolve(temporary, relative)
      await mkdir(directory, { recursive: true })
      await writeFile(path.join(directory, ".gitkeep"), "", "utf8")
    }

    const rootTemplates = ["README.md", "project.yaml", "CONTEXT.md", "DECISIONS.md", "STATUS.md"]
    for (const templateName of rootTemplates) {
      const content = render(await loadTemplate(root, `project/${templateName}`), replacements)
      await writeFile(path.join(temporary, templateName), content, "utf8")
    }
    const domainReadmes = new Map([
      ["market-research.README.md", "market-research/README.md"],
      ["marketing.README.md", "marketing/README.md"],
      ["legal.README.md", "legal/README.md"],
    ])
    for (const [templateName, targetName] of domainReadmes) {
      const content = render(await loadTemplate(root, `project/${templateName}`), replacements)
      await writeFile(safeResolve(temporary, targetName), content, "utf8")
    }
    const candidateFile = path.join(temporary, "project.yaml")
    const candidate = await readYamlFile(candidateFile)
    await assertSchema(root, "project", candidate)
    assertProjectIdentity(candidate, slug, candidateFile)
    const files = (await walkFiles(temporary))
      .map((file) => path.relative(temporary, file).replaceAll(path.sep, "/"))
      .map((relative) => `projects/${slug}/${relative}`)
      .sort()
    if (destinationExists) await rm(destination, { recursive: false, force: false })
    await rename(temporary, destination)
    moved = true
    const index = await updateProjectIndex(root)
    return {
      schema: PROJECT_SCHEMA_VERSION,
      id: slug,
      name,
      path: path.relative(root, destination).replaceAll(path.sep, "/"),
      created_at: createdAt,
      files,
      index,
    }
  } catch (error) {
    await rm(moved ? destination : temporary, { recursive: true, force: true })
    throw error
  }
}

export async function resolveProject(root, query) {
  const needle = String(query || "").trim()
  if (!needle) throw new Error("Project query is required")
  const projects = await listProjects(root)
  const normalizedName = needle.toLocaleLowerCase("fr")
  const slugCandidate = (() => {
    try { return slugifyProjectName(needle) } catch { return null }
  })()
  const matches = projects.filter((project) =>
    project.id === needle ||
    project.id === slugCandidate ||
    String(project.name).toLocaleLowerCase("fr") === normalizedName,
  )
  if (matches.length === 0) throw new Error(`Unknown project: ${needle}`)
  if (matches.length > 1) throw new Error(`Ambiguous project query: ${needle}`)
  const project = matches[0]
  return {
    id: project.id,
    name: project.name,
    path: `projects/${project.id}`,
    status: project.status,
    domains: project.domains,
    repositories: project.repositories,
    deployment: project.deployment,
  }
}

async function walkFiles(directory) {
  const result = []
  if (!(await pathExists(directory))) return result
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) result.push(...await walkFiles(target))
    else if (entry.isFile()) result.push(target)
  }
  return result
}

export async function getProjectStatus(root, slug) {
  const { directory, project } = await readProject(root, assertSafeSlug(slug))
  const files = await walkFiles(directory)
  const reports = []
  for (const file of files.filter((candidate) => candidate.endsWith(".md"))) {
    const content = await readFile(file, "utf8")
    if (!content.startsWith("---")) continue
    const details = await stat(file)
    reports.push({
      path: path.relative(root, file).replaceAll(path.sep, "/"),
      modified_at: details.mtime.toISOString(),
    })
  }
  reports.sort((a, b) => b.modified_at.localeCompare(a.modified_at))
  const development_repositories = {}
  for (const domain of ["web", "mobile", "shopify"]) {
    const configured = project.repositories?.[domain + "_path"]
    development_repositories[domain] = configured
      ? { path: configured, exists: await pathExists(safeResolve(root, configured)) }
      : { path: null, exists: false }
  }
  return {
    id: project.id,
    name: project.name,
    status: project.status,
    updated_at: project.updated_at,
    domains: project.domains,
    domain_status: { market: project.market, marketing: project.marketing, legal: project.legal, it: project.it },
    development_repositories,
    latest_reports: reports.slice(0, 20),
  }
}

export function parseMarkdownFrontmatter(content) {
  const normalized = content.replace(/^\uFEFF/, "")
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) throw new Error("Markdown report must start with closed YAML frontmatter")
  const frontmatter = parseYaml(match[1])
  if (!frontmatter || typeof frontmatter !== "object") throw new Error("Invalid YAML frontmatter")
  return { frontmatter, body: match[2] }
}

export async function validateReportFile(root, relativePath, expectedProject) {
  const normalized = String(relativePath).replaceAll("\\", "/")
  if (!normalized.endsWith(".md")) throw new Error("Report path must be a Markdown file")
  const projectFromBusinessPath = normalized.startsWith("projects/") ? normalized.split("/")[1] : null
  const projectId = expectedProject || projectFromBusinessPath
  if (!projectId) throw new Error("Development reports require expectedProject")
  const { project } = await readProject(root, projectId)
  const permittedRoots = [project.repositories.business_path, project.repositories.web_path, project.repositories.mobile_path, project.repositories.shopify_path].filter(Boolean)
  if (!permittedRoots.some((prefix) => normalized.startsWith(String(prefix).replaceAll("\\", "/") + "/"))) {
    throw new Error("Report path must stay under the business project or a registered development repository")
  }
  const target = safeResolve(root, normalized)
  const { frontmatter, body } = parseMarkdownFrontmatter(await readFile(target, "utf8"))
  const errors = []
  try {
    await assertSchema(root, "report", frontmatter)
  } catch (error) {
    errors.push(error.message)
  }
  if (frontmatter.project !== projectId) errors.push("frontmatter project does not match report path")
  if (!(await pathExists(path.join(root, ".opencode", "agents", `${frontmatter.agent}.md`)))) {
    errors.push(`unknown report agent: ${frontmatter.agent}`)
  }
  for (const section of REPORT_SECTIONS) {
    if (!new RegExp(`^##\\s+${escapeRegExp(section)}\\s*$`, "mi").test(body)) errors.push(`missing section: ${section}`)
  }
  const sourcesMatch = body.match(/^##\s+Sources\s*$([\s\S]*)$/mi)
  const sourcesBody = sourcesMatch?.[1]?.trim() || ""
  if (!sourcesBody || /^[-*]\s*(source\s*)?[—-]?\s*url/i.test(sourcesBody)) errors.push("Sources section must contain at least one concrete source")
  return { valid: errors.length === 0, path: normalized, frontmatter, errors }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export async function registerEvidence(root, input, actor = null) {
  const slug = assertSafeSlug(String(input.project))
  const { project } = await readProject(root, slug)
  if (actor && input.agent !== actor) throw new Error(`Evidence agent must match the caller (${actor})`)
  const scope = String(input.scope || "")
  if (![...Object.keys(EVIDENCE_DIRECTORIES), "web", "mobile", "shopify"].includes(scope)) throw new Error("Evidence scope is required and must name a supported project domain")
  if (actor && !EVIDENCE_ACTOR_SCOPES[actor]?.includes(scope)) throw new Error(`Agent ${actor} cannot register ${scope} evidence`)
  const url = new URL(String(input.url))
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error("Evidence URL must use http or https")
  const checkedAt = input.checked_at ? new Date(input.checked_at) : new Date()
  if (Number.isNaN(checkedAt.getTime())) throw new Error("Invalid checked_at")
  const allowedConfidence = new Set(["FACT", "SOURCE", "INFERENCE", "ESTIMATE", "UNKNOWN"])
  const confidence = String(input.confidence || "SOURCE")
  if (!allowedConfidence.has(confidence)) throw new Error("Invalid confidence classification")
  const evidenceId = randomUUID()
  const record = {
    schema: "evidence.v1",
    evidence_id: evidenceId,
    project: slug,
    scope,
    url: url.toString(),
    title: String(input.title || "").trim(),
    provider: String(input.provider || "").trim(),
    checked_at: checkedAt.toISOString(),
    agent: String(input.agent || "").trim(),
    claim: String(input.claim || "").trim(),
    confidence,
    source_type: String(input.source_type || "primary"),
    retrieved_via: String(input.retrieved_via || "web"),
    notes: String(input.notes || ""),
  }
  if (!record.title || !record.provider || !record.claim || !AGENT_ID.test(record.agent)) throw new Error("Evidence title, provider, claim and valid agent are required")
  if (!(await pathExists(path.join(root, ".opencode", "agents", `${record.agent}.md`)))) throw new Error(`Unknown evidence agent: ${record.agent}`)
  await assertSchema(root, "evidence", record)
  const evidenceDirectory = projectDirectory(root, slug)
  const technicalRoot = project.repositories?.[scope + "_path"]
  const targetDirectory = technicalRoot
    ? safeResolve(root, technicalRoot, "docs", "opencode", "evidence")
    : safeResolve(evidenceDirectory, EVIDENCE_DIRECTORIES[scope])
  await mkdir(targetDirectory, { recursive: true })
  const target = path.join(targetDirectory, `${checkedAt.toISOString().replace(/[:.]/g, "-")}-${evidenceId}.yaml`)
  await writeFile(target, stringifyYaml(record, { lineWidth: 0 }), "utf8")
  return { evidence_id: evidenceId, path: path.relative(root, target).replaceAll(path.sep, "/"), record }
}

export function validateDelegation(input, knownAgents = null) {
  const errors = []
  if (input.schema !== "task.v1") errors.push("schema must be task.v1")
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(input.task_id || ""))) errors.push("invalid task_id UUID")
  if (!PROJECT_SLUG.test(String(input.project_id || ""))) errors.push("invalid project_id")
  if (!AGENT_ID.test(String(input.requested_by || ""))) errors.push("invalid requested_by")
  if (!AGENT_ID.test(String(input.target_agent || ""))) errors.push("invalid target_agent")
  const objectiveLength = String(input.objective || "").trim().length
  if (objectiveLength < 12 || objectiveLength > 2000) errors.push("objective must contain 12-2000 characters")
  const expectedOutputLength = String(input.expected_output || "").trim().length
  if (expectedOutputLength < 3 || expectedOutputLength > 500) errors.push("expected_output must contain 3-500 characters")
  const expectedBusinessPrefix = `projects/${input.project_id}/`
  const expectedDevPrefix = `dev/${input.project_id}/`
  const normalizedOutput = String(input.output_path || "").replaceAll("\\", "/")
  if ((!normalizedOutput.startsWith(expectedBusinessPrefix) && !normalizedOutput.startsWith(expectedDevPrefix)) || normalizedOutput.includes("../")) errors.push("output_path escapes project scope")
  if (!Number.isInteger(input.delegation_depth) || input.delegation_depth < 0 || input.delegation_depth > MAX_DELEGATION_DEPTH) errors.push("delegation_depth must be between 0 and 4")
  if (!Array.isArray(input.visited_agents) || new Set(input.visited_agents).size !== input.visited_agents?.length || input.visited_agents?.some((agent) => !AGENT_ID.test(String(agent)))) errors.push("visited_agents must be a unique array of valid agent IDs")
  if (input.visited_agents?.includes(input.target_agent)) errors.push("target_agent was already visited")
  if (input.requested_by && !input.visited_agents?.includes(input.requested_by)) errors.push("requested_by must be present in visited_agents")
  if (knownAgents && !knownAgents.has(input.target_agent)) errors.push("unknown target_agent")
  if (knownAgents && !knownAgents.has(input.requested_by)) errors.push("unknown requested_by")
  if (!["best-effort", "hard-deadline", "none"].includes(input.deadline_policy)) errors.push("invalid deadline_policy")
  if (input.deadline !== undefined && input.deadline !== null && Number.isNaN(Date.parse(String(input.deadline)))) errors.push("invalid deadline")
  if (input.deadline_policy === "hard-deadline" && !input.deadline) errors.push("hard-deadline requires deadline")
  return { valid: errors.length === 0, errors }
}

async function runGit(root, args, options = {}) {
  try {
    const { stdout, stderr } = await execFileAsync("git", args, { cwd: root, windowsHide: true, maxBuffer: 10 * 1024 * 1024, ...options })
    return { stdout: stdout.trim(), stderr: stderr.trim() }
  } catch (error) {
    const detail = String(error.stderr || error.stdout || error.message).trim()
    throw new Error(`git ${args[0]} failed: ${detail}`)
  }
}

function scopePaths(slug, scope, project) {
  const base = `projects/${slug}`
  const shared = [
    `${base}/project.yaml`,
    `${base}/STATUS.md`,
    `${base}/DECISIONS.md`,
    `${base}/logs`,
    "projects/_index.md",
  ]
  const mapping = {
    project: [base, "projects/_index.md"],
    market: [`${base}/market-research`, ...shared],
    marketing: [`${base}/marketing`, ...shared],
    web: [project.repositories.web_path].filter(Boolean),
    mobile: [project.repositories.mobile_path].filter(Boolean),
    shopify: [project.repositories.shopify_path].filter(Boolean),
    legal: [`${base}/legal`, ...shared],
    opportunity: [`${base}/opportunities`, ...shared],
    status: shared,
  }
  if (!mapping[scope]) throw new Error(`Unsupported checkpoint scope: ${scope}`)
  return mapping[scope]
}

const ACTOR_SCOPES = {
  "global-orchestrator": ["project", "market", "marketing", "web", "mobile", "shopify", "legal", "opportunity", "status"],
  "business-orchestrator": ["market", "marketing", "opportunity", "status"],
  "it-orchestrator": ["web", "mobile", "shopify", "status"],
  "market-orchestrator": ["market"],
  "marketing-orchestrator": ["marketing"],
  "web-orchestrator": ["web"],
  "mobile-orchestrator": ["mobile"],
  "shopify-orchestrator": ["shopify"],
  "seo-geo-researcher": ["market"],
  "ecommerce-intelligence": ["market"],
  "advertising-intelligence": ["market"],
  "opportunity-researcher": ["opportunity"],
  "persona-strategist": ["marketing"],
  "creative-producer": ["marketing"],
  "legal-auditor": ["legal"],
  "web-devops-release": ["web"],
  "mobile-release": ["mobile"],
  "shopify-release": ["shopify"],
}

function normalizeGitPath(value) {
  const normalized = String(value || "").trim().replaceAll("\\", "/").replace(/^\.\//, "").replace(/\/$/, "")
  if (!normalized || path.posix.isAbsolute(normalized) || /^[A-Za-z]:/.test(normalized) || normalized.includes("\0")) throw new Error(`Invalid checkpoint path: ${value}`)
  if (normalized.split("/").some((segment) => !segment || segment === "." || segment === "..")) throw new Error(`Unsafe checkpoint path: ${value}`)
  return normalized
}

function isAllowedGitPath(file, allowed) {
  const normalized = file.replaceAll("\\", "/")
  return allowed.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`))
}

async function scanSecrets(root, allowedPaths) {
  const candidates = []
  for (const relative of allowedPaths) {
    const absolute = safeResolve(root, relative)
    if (!(await pathExists(absolute))) continue
    const details = await stat(absolute)
    if (details.isDirectory()) candidates.push(...await walkFiles(absolute))
    else candidates.push(absolute)
  }
  const patterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
    /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/,
    /\bAKIA[0-9A-Z]{16}\b/,
    /(?:api[_-]?key|client[_-]?secret|access[_-]?token|password)\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{16,}/i,
  ]
  const findings = []
  for (const file of candidates) {
    const details = await stat(file)
    if (details.size > 2_000_000) continue
    const buffer = await readFile(file)
    if (buffer.includes(0)) continue
    const text = buffer.toString("utf8")
    if (patterns.some((pattern) => pattern.test(text))) findings.push(path.relative(root, file).replaceAll(path.sep, "/"))
  }
  return findings
}

export async function gitCheckpoint(root, input, actor = null) {
  const slug = assertSafeSlug(String(input.project))
  const { project } = await readProject(root, slug)
  const scope = String(input.scope || "project")
  const message = String(input.message || "").trim()
  const push = Boolean(input.push)
  const rebase = Boolean(input.rebase)
  const allowed = scopePaths(slug, scope, project)
  if (!allowed.length) throw new Error(`No development repository is registered for ${scope}`)
  if (actor) {
    const actorScopes = ACTOR_SCOPES[actor]
    if (!actorScopes || !actorScopes.includes(scope)) throw new Error(`Agent ${actor} cannot checkpoint scope ${scope}`)
    if (rebase && actor !== "global-orchestrator") throw new Error("Only global-orchestrator may request a rebase")
  }
  if (!Array.isArray(input.paths) || input.paths.length === 0) throw new Error("Checkpoint paths are required; pass only files owned by this workflow")
  const selected = [...new Set(input.paths.map(normalizeGitPath))]
  const escaped = selected.filter((file) => !isAllowedGitPath(file, allowed))
  if (escaped.length) throw new Error(`Checkpoint paths escape scope ${scope}: ${escaped.join(", ")}`)
  if (!/^(?:chore|research|docs|feat|fix|test|refactor|security|release|build|ci)(?:\([a-z0-9-]+\))?!?: .{3,120}$/.test(message)) {
    throw new Error("Commit message must use Conventional Commits and contain 3-120 subject characters")
  }

  const repositoryPath = ["web", "mobile", "shopify"].includes(scope) ? project.repositories[scope + "_path"] : "."
  const repositoryRoot = safeResolve(root, repositoryPath)
  const repositoryPrefix = path.relative(root, repositoryRoot).replaceAll(path.sep, "/")
  const repositorySelected = repositoryRoot === path.resolve(root) ? selected : selected.map((file) => file.slice(repositoryPrefix.length + 1))
  if (repositorySelected.some((file) => !file || file.startsWith("../"))) throw new Error("Checkpoint path is outside its development repository")
  const topLevel = (await runGit(repositoryRoot, ["rev-parse", "--show-toplevel"])).stdout
  if (path.resolve(topLevel) !== path.resolve(repositoryRoot)) throw new Error("Configured repository path is not the Git repository root")
  const branch = (await runGit(repositoryRoot, ["branch", "--show-current"])).stdout
  if (!branch) throw new Error("Detached HEAD is not supported")
  const protectedBranch = /^(main|master|trunk|production|release(?:\/.*)?)$/i.test(branch)
  if (push && protectedBranch) throw new Error(`Refusing direct push from protected branch: ${branch}`)
  if (push && !branch.startsWith(`project/${slug}`)) throw new Error(`Push branch must start with project/${slug}`)

  const alreadyStaged = (await runGit(repositoryRoot, ["diff", "--cached", "--name-only", "-z"])).stdout.split("\0").filter(Boolean)
  const foreign = alreadyStaged.filter((file) => !isAllowedGitPath(file, repositorySelected))
  if (foreign.length) throw new Error(`Unrelated staged files detected: ${foreign.join(", ")}`)

  const secrets = await scanSecrets(root, selected)
  if (secrets.length) throw new Error(`Potential secrets detected; checkpoint refused: ${secrets.join(", ")}`)

  let hasUpstream = false
  let behind = 0
  if (push) {
    await runGit(repositoryRoot, ["fetch", "--prune"])
    try {
      await runGit(repositoryRoot, ["rev-parse", "--abbrev-ref", "@{upstream}"])
      hasUpstream = true
      const counts = (await runGit(repositoryRoot, ["rev-list", "--left-right", "--count", "HEAD...@{upstream}"])).stdout.split(/\s+/).map(Number)
      behind = counts[1] || 0
      if (behind > 0 && !rebase) throw new Error(`Remote branch is ahead by ${behind} commit(s); rerun through /sync with explicit rebase`)
    } catch (error) {
      if (!String(error.message).includes("no upstream") && !String(error.message).includes("unknown revision")) throw error
    }
  }

  await runGit(repositoryRoot, ["add", "--", ...repositorySelected])
  const staged = (await runGit(repositoryRoot, ["diff", "--cached", "--name-only", "-z"])).stdout.split("\0").filter(Boolean)
  const stagedForeign = staged.filter((file) => !isAllowedGitPath(file, repositorySelected))
  if (stagedForeign.length) throw new Error(`Checkpoint escaped scope: ${stagedForeign.join(", ")}`)
  if (!staged.length) return { committed: false, pushed: false, branch, files: [], reason: "no changes" }

  await runGit(repositoryRoot, ["commit", "-m", message])
  let commit = (await runGit(repositoryRoot, ["rev-parse", "HEAD"])).stdout
  let rebased = false
  if (push) {
    if (hasUpstream && behind > 0) {
      const dirty = (await runGit(repositoryRoot, ["status", "--porcelain"])).stdout
      if (dirty) throw new Error("Local checkpoint committed, but rebase was not started because unrelated working-tree changes remain")
      try {
        await runGit(repositoryRoot, ["rebase", "@{upstream}"])
        rebased = true
        commit = (await runGit(repositoryRoot, ["rev-parse", "HEAD"])).stdout
      } catch (error) {
        try { await runGit(repositoryRoot, ["rebase", "--abort"]) } catch {}
        throw new Error(`Rebase failed and was aborted: ${error.message}`)
      }
    }
    if (hasUpstream) await runGit(repositoryRoot, ["push"])
    else await runGit(repositoryRoot, ["push", "--set-upstream", "origin", branch])
  }
  return { committed: true, pushed: push, rebased, branch, commit, files: staged.map((file) => repositoryPrefix ? `${repositoryPrefix}/${file}` : file) }
}
