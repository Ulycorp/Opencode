import test from "node:test"
import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { promisify } from "node:util"
import { fileURLToPath } from "node:url"
import {
  agentMayWriteOutput,
  gitCheckpoint,
  initializeProject,
  listProjects,
  pathExists,
  registerEvidence,
  resolveProject,
  slugifyProjectName,
  validateDelegation,
  validateReportFile,
} from "../internal/lib/workspace.mjs"

const execFileAsync = promisify(execFile)
const SOURCE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

async function temporaryWorkspace(t) {
  const parent = path.resolve(os.tmpdir())
  const root = await mkdtemp(path.join(parent, "opencode-workspace-test-"))
  assert.ok(root.startsWith(`${parent}${path.sep}`), "temporary workspace must stay under the OS temp directory")
  await writeFile(path.join(root, "opencode.json"), "{}\n")
  await mkdir(path.join(root, "projects"), { recursive: true })
  await cp(path.join(SOURCE_ROOT, "templates"), path.join(root, "templates"), { recursive: true })
  await cp(path.join(SOURCE_ROOT, "schemas"), path.join(root, "schemas"), { recursive: true })
  await mkdir(path.join(root, ".opencode", "agents"), { recursive: true })
  for (const agent of ["global-orchestrator", "market-orchestrator", "seo-geo-researcher", "legal-auditor"]) {
    await writeFile(path.join(root, ".opencode", "agents", `${agent}.md`), `---\ndescription: test agent ${agent}\n---\n`)
  }
  t.after(async () => {
    assert.ok(root.startsWith(`${parent}${path.sep}`), "cleanup target must stay under temp")
    await rm(root, { recursive: true, force: true })
  })
  return root
}

test("slugification is canonical and rejects unsafe input", () => {
  assert.equal(slugifyProjectName("École du Futur"), "ecole-du-futur")
  assert.equal(slugifyProjectName("  Glow Skin 2026  "), "glow-skin-2026")
  assert.throws(() => slugifyProjectName("---"), /Invalid project slug/)
  assert.throws(() => slugifyProjectName(""), /Project name/)
})

test("project initialization is complete, atomic and indexed", async (t) => {
  const root = await temporaryWorkspace(t)
  const result = await initializeProject(root, {
    name: "École du Futur",
    description: "Plateforme éducative personnalisée.",
    domains: ["market", "web"],
  })
  assert.equal(result.id, "ecole-du-futur")
  assert.ok(result.files.includes("projects/ecole-du-futur/project.yaml"))
  assert.ok(result.files.includes("projects/ecole-du-futur/market-research/evidence/.gitkeep"))
  for (const relative of [
    "project.yaml", "README.md", "CONTEXT.md", "DECISIONS.md", "STATUS.md",
    "market-research/evidence/.gitkeep", "marketing/creatives/generated/.gitkeep",
    "marketing/evidence/.gitkeep", "legal/audits/.gitkeep", "legal/evidence/.gitkeep",
    "opportunities/funding/.gitkeep", "shared/sources/.gitkeep", "logs/runs/.gitkeep",
  ]) assert.equal(await pathExists(path.join(root, "projects", result.id, relative)), true, `missing ${relative}`)
  assert.equal(await pathExists(path.join(root, "projects", result.id, "it")), false)
  assert.equal(await pathExists(path.join(root, "dev", result.id)), false)
  const index = await readFile(path.join(root, "projects", "_index.md"), "utf8")
  assert.match(index, /École du Futur/)
  assert.match(index, /\.\/ecole-du-futur\/README\.md/)
  await assert.rejects(() => initializeProject(root, { name: "École du Futur" }), /already contains files/)
  const escaped = await initializeProject(root, { name: 'Studio "A" \\ Mobile', description: "Ligne 1\nLigne 2 \\ test" })
  assert.equal((await resolveProject(root, escaped.id)).name, 'Studio "A" \\ Mobile')
})

test("project resolution accepts name and slug and rejects unknown projects", async (t) => {
  const root = await temporaryWorkspace(t)
  await initializeProject(root, { name: "GlowSkin" })
  assert.equal((await resolveProject(root, "GlowSkin")).id, "glowskin")
  assert.equal((await resolveProject(root, "glowskin")).name, "GlowSkin")
  await assert.rejects(() => resolveProject(root, "missing"), /Unknown project/)
})

test("report validator enforces frontmatter, project path, sections and concrete sources", async (t) => {
  const root = await temporaryWorkspace(t)
  await initializeProject(root, { name: "Report Test" })
  const reportPath = path.join(root, "projects", "report-test", "market-research", "seo-geo.md")
  const content = `---
schema: "report.v1"
workspace_version: "1.0.0"
project: "report-test"
agent: "seo-geo-researcher"
type: "market.seo-geo"
status: "complete"
generated_at: "2026-07-31T20:00:00+02:00"
sources_checked_at: "2026-07-31"
---

# SEO

## Résumé exécutif
Résumé.
## Objectif
Objectif.
## Méthodologie
Méthode.
## Données / observations
FACT — observation.
## Analyse
Analyse.
## Recommandations
Recommandations.
## Limites
Limites.
## Sources
- Documentation officielle — https://example.gouv.fr — consultée le 2026-07-31.
`
  await writeFile(reportPath, content)
  const valid = await validateReportFile(root, "projects/report-test/market-research/seo-geo.md", "report-test")
  assert.equal(valid.valid, true, valid.errors.join("; "))
  await writeFile(reportPath, content.replace(/- Documentation officielle[^\n]+/, ""))
  const invalid = await validateReportFile(root, "projects/report-test/market-research/seo-geo.md", "report-test")
  assert.equal(invalid.valid, false)
  assert.ok(invalid.errors.includes("Sources section must contain at least one concrete source"))

  await writeFile(reportPath, content.replace('status: "complete"', 'status: "nonsense"'))
  const invalidSchema = await validateReportFile(root, "projects/report-test/market-research/seo-geo.md", "report-test")
  assert.equal(invalidSchema.valid, false)
  assert.match(invalidSchema.errors.join("; "), /status/)
})

test("delegation validation rejects loops, path escapes and excessive depth", () => {
  const valid = {
    schema: "task.v1",
    task_id: "11111111-1111-4111-8111-111111111111",
    project_id: "demo",
    requested_by: "market-orchestrator",
    target_agent: "seo-geo-researcher",
    objective: "Produce the bounded SEO market report.",
    expected_output: "Validated report.v1",
    output_path: "projects/demo/market-research/seo-geo.md",
    delegation_depth: 2,
    visited_agents: ["global-orchestrator", "market-orchestrator"],
    deadline_policy: "best-effort",
  }
  assert.equal(validateDelegation(valid).valid, true)
  assert.equal(validateDelegation({ ...valid, delegation_depth: 5 }).valid, false)
  assert.equal(validateDelegation({ ...valid, visited_agents: [...valid.visited_agents, valid.target_agent] }).valid, false)
  assert.equal(validateDelegation({ ...valid, output_path: "projects/other/report.md" }).valid, false)
  assert.equal(validateDelegation(valid, new Set(["market-orchestrator"])).valid, false)
})

test("evidence registration is confined to the project and rejects non-HTTP URLs", async (t) => {
  const root = await temporaryWorkspace(t)
  await initializeProject(root, { name: "Evidence" })
  const result = await registerEvidence(root, {
    project: "evidence",
    scope: "legal",
    url: "https://www.legifrance.gouv.fr/",
    title: "Légifrance",
    provider: "legifrance",
    agent: "legal-auditor",
    claim: "Official legal source consulted.",
    confidence: "SOURCE",
    source_type: "official",
  })
  assert.match(result.path, /^projects\/evidence\/legal\/evidence\//)
  assert.equal(await pathExists(path.join(root, result.path)), true)
  await assert.rejects(() => registerEvidence(root, {
    project: "evidence", scope: "legal", url: "file:///etc/passwd", title: "Bad", provider: "local",
    agent: "legal-auditor", claim: "bad",
  }), /http or https/)
  await assert.rejects(() => registerEvidence(root, {
    project: "evidence", scope: "market", url: "https://www.legifrance.gouv.fr/", title: "Bad scope",
    provider: "legifrance", agent: "legal-auditor", claim: "Wrong ownership boundary",
  }, "legal-auditor"), /cannot register market evidence/)
})

test("git checkpoint refuses protected pushes and detected secrets", async (t) => {
  const root = await temporaryWorkspace(t)
  await initializeProject(root, { name: "Git Test" })
  await execFileAsync("git", ["init", "-b", "main"], { cwd: root, windowsHide: true })
  await execFileAsync("git", ["config", "user.email", "tests@example.invalid"], { cwd: root, windowsHide: true })
  await execFileAsync("git", ["config", "user.name", "Workspace Tests"], { cwd: root, windowsHide: true })
  await execFileAsync("git", ["add", "."], { cwd: root, windowsHide: true })
  await execFileAsync("git", ["commit", "-m", "chore: seed test workspace"], { cwd: root, windowsHide: true })
  await assert.rejects(() => gitCheckpoint(root, {
    project: "git-test", scope: "project", paths: ["projects/git-test", "projects/_index.md"], message: "chore(project): checkpoint git-test", push: true,
  }), /protected branch/)

  await execFileAsync("git", ["switch", "-c", "project/git-test"], { cwd: root, windowsHide: true })
  await writeFile(path.join(root, "projects", "git-test", "shared", "sources", "secret.md"), "token = sk-proj-abcdefghijklmnopqrstuvwxyz123456")
  await assert.rejects(() => gitCheckpoint(root, {
    project: "git-test", scope: "project", paths: ["projects/git-test/shared/sources/secret.md"], message: "docs(project): add project research", push: false,
  }), /Potential secrets detected/)

  await assert.rejects(() => gitCheckpoint(root, {
    project: "git-test", scope: "project", paths: ["projects/git-test/STATUS.md"], message: "docs(project): update status", push: false,
  }, "legal-auditor"), /cannot checkpoint scope project/)

  const selected = path.join(root, "projects", "git-test", "shared", "sources", "selected.md")
  const concurrent = path.join(root, "projects", "git-test", "shared", "sources", "concurrent.md")
  await writeFile(selected, "selected workflow output\n")
  await writeFile(concurrent, "unrelated concurrent output\n")
  const checkpoint = await gitCheckpoint(root, {
    project: "git-test", scope: "project", paths: ["projects/git-test/shared/sources/selected.md"],
    message: "docs(project): add selected workflow output", push: false,
  }, "global-orchestrator")
  assert.equal(checkpoint.committed, true)
  assert.deepEqual(checkpoint.files, ["projects/git-test/shared/sources/selected.md"])
  const status = (await execFileAsync("git", ["status", "--porcelain"], { cwd: root, windowsHide: true })).stdout
  assert.match(status, /concurrent\.md/)
})

test("invalid project metadata is surfaced instead of disappearing from the index", async (t) => {
  const root = await temporaryWorkspace(t)
  await initializeProject(root, { name: "Broken Later" })
  const file = path.join(root, "projects", "broken-later", "project.yaml")
  const content = await readFile(file, "utf8")
  await writeFile(file, content.replace('status: "active"', 'status: "impossible"'))
  await assert.rejects(() => listProjects(root), /Invalid project directory broken-later/)
  await assert.rejects(() => initializeProject(root, { name: "Must Roll Back" }), /Invalid project directory broken-later/)
  assert.equal(await pathExists(path.join(root, "projects", "must-roll-back")), false)
})

test("technical checkpoints use the separately owned development repository", async (t) => {
  const root = await temporaryWorkspace(t)
  await initializeProject(root, { name: "Dev Test" })
  const repo = path.join(root, "dev", "dev-test", "web")
  await mkdir(repo, { recursive: true })
  await execFileAsync("git", ["init", "-b", "project/dev-test"], { cwd: repo, windowsHide: true })
  await execFileAsync("git", ["config", "user.email", "tests@example.invalid"], { cwd: repo, windowsHide: true })
  await execFileAsync("git", ["config", "user.name", "Workspace Tests"], { cwd: repo, windowsHide: true })
  await writeFile(path.join(repo, "README.md"), "seed\n")
  await execFileAsync("git", ["add", "README.md"], { cwd: repo, windowsHide: true })
  await execFileAsync("git", ["commit", "-m", "chore: seed development repository"], { cwd: repo, windowsHide: true })
  await writeFile(path.join(repo, "README.md"), "changed\n")
  const checkpoint = await gitCheckpoint(root, {
    project: "dev-test", scope: "web", paths: ["dev/dev-test/web/README.md"],
    message: "docs(web): update development readme", push: false,
  }, "web-orchestrator")
  assert.equal(checkpoint.committed, true)
  assert.deepEqual(checkpoint.files, ["dev/dev-test/web/README.md"])
})

test("delegation validation rejects unknown targets and output ownership violations", async () => {
  const task = {
    schema: "task.v1",
    task_id: "22222222-2222-4222-8222-222222222222",
    project_id: "demo",
    requested_by: "market-orchestrator",
    target_agent: "seo-geo-researcher",
    objective: "Produce the bounded and sourced SEO market report.",
    expected_output: "Validated report.v1",
    output_path: "projects/demo/market-research/seo-geo.md",
    delegation_depth: 1,
    visited_agents: ["market-orchestrator"],
    deadline_policy: "best-effort",
  }
  const known = new Set(["market-orchestrator", "seo-geo-researcher", "legal-auditor"])
  assert.equal(validateDelegation(task, known).valid, true)
  assert.equal(validateDelegation({ ...task, target_agent: "missing-agent" }, known).valid, false)
  const seo = await readFile(path.join(SOURCE_ROOT, ".opencode", "agents", "seo-geo-researcher.md"), "utf8")
  const legal = await readFile(path.join(SOURCE_ROOT, ".opencode", "agents", "legal-auditor.md"), "utf8")
  assert.equal(agentMayWriteOutput(seo, task.output_path), true)
  assert.equal(agentMayWriteOutput(legal, task.output_path), false)
})
