export class SourceHttpError extends Error {
  readonly status: number
  readonly url: string

  constructor(message: string, status: number, url: string) {
    super(message)
    this.name = "SourceHttpError"
    this.status = status
    this.url = url
  }
}

export type OfficialUrlPolicy =
  | "piste-oauth"
  | "piste-api"
  | "legifrance"
  | "bofip-data"
  | "bofip-public"
  | "cnil"

type HostPolicy = {
  label: string
  hosts: readonly string[]
  allowSubdomains?: boolean
}

const OFFICIAL_HOSTS: Record<OfficialUrlPolicy, HostPolicy> = {
  "piste-oauth": { label: "PISTE OAuth", hosts: ["oauth.piste.gouv.fr"] },
  "piste-api": { label: "PISTE / Légifrance API", hosts: ["api.piste.gouv.fr"] },
  legifrance: { label: "Légifrance", hosts: ["legifrance.gouv.fr"], allowSubdomains: true },
  "bofip-data": { label: "BOFiP official dataset", hosts: ["data.economie.gouv.fr"] },
  "bofip-public": { label: "BOFiP", hosts: ["bofip.impots.gouv.fr"] },
  cnil: { label: "CNIL", hosts: ["cnil.fr"], allowSubdomains: true },
}

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308])
const MAX_REDIRECTS = 5

function hostnameAllowed(hostname: string, policy: HostPolicy): boolean {
  const normalized = hostname.toLowerCase().replace(/\.$/, "")
  return policy.hosts.some((host) => {
    const allowed = host.toLowerCase()
    return normalized === allowed || Boolean(policy.allowSubdomains && normalized.endsWith(`.${allowed}`))
  })
}

export function assertOfficialUrl(value: string | URL, policyName: OfficialUrlPolicy): URL {
  const policy = OFFICIAL_HOSTS[policyName]
  let url: URL
  try {
    url = value instanceof URL ? new URL(value.href) : new URL(value)
  } catch {
    throw new Error(`${policy.label} URL is invalid`)
  }
  if (url.protocol !== "https:") throw new Error(`${policy.label} URL must use HTTPS`)
  if (url.username || url.password) throw new Error(`${policy.label} URL must not contain credentials`)
  if (url.port && url.port !== "443") throw new Error(`${policy.label} URL must use the standard HTTPS port`)
  if (!hostnameAllowed(url.hostname, policy)) {
    throw new Error(`${policy.label} URL host is not approved: ${url.hostname}`)
  }
  return url
}

export function httpTimeoutMs(): number {
  const parsed = Number(process.env.FR_LEGAL_HTTP_TIMEOUT_MS || 20_000)
  return Number.isFinite(parsed) && parsed >= 1_000 ? Math.min(parsed, 120_000) : 20_000
}

export async function fetchOfficial(
  url: string | URL,
  init: RequestInit,
  policy: OfficialUrlPolicy,
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), httpTimeoutMs())
  try {
    let current = assertOfficialUrl(url, policy)
    let method = String(init.method || "GET").toUpperCase()
    let body = init.body
    const headers = new Headers(init.headers)
    if (!headers.has("Accept")) headers.set("Accept", "application/json, text/html;q=0.9, */*;q=0.5")
    if (!headers.has("User-Agent")) headers.set("User-Agent", "opencode-fr-legal-mcp/1.0 (+local research client)")

    for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
      const response = await fetch(current, {
        ...init,
        method,
        body,
        headers,
        redirect: "manual",
        signal: controller.signal,
      })
      if (!REDIRECT_STATUSES.has(response.status)) {
        if (!response.ok) {
          const detail = (await response.text()).slice(0, 500).replace(/\s+/g, " ")
          throw new SourceHttpError(`Official source returned HTTP ${response.status}: ${detail}`, response.status, current.href)
        }
        return response
      }

      if (redirects === MAX_REDIRECTS) throw new Error(`Official source exceeded ${MAX_REDIRECTS} redirects`)
      const location = response.headers.get("location")
      if (!location) throw new Error(`Official source returned HTTP ${response.status} without a Location header`)
      const next = assertOfficialUrl(new URL(location, current), policy)

      if (next.origin !== current.origin) {
        headers.delete("authorization")
        headers.delete("proxy-authorization")
        headers.delete("cookie")
        headers.delete("cookie2")
      }
      if (response.status === 303 || ((response.status === 301 || response.status === 302) && method === "POST")) {
        method = "GET"
        body = undefined
        headers.delete("content-type")
        headers.delete("content-length")
      }
      current = next
    }

    throw new Error(`Official source exceeded ${MAX_REDIRECTS} redirects`)
  } finally {
    clearTimeout(timer)
  }
}

export async function fetchJson<T = unknown>(
  url: string | URL,
  init: RequestInit,
  policy: OfficialUrlPolicy,
): Promise<T> {
  const response = await fetchOfficial(url, init, policy)
  const contentType = response.headers.get("content-type") || ""
  if (!contentType.includes("json")) throw new SourceHttpError("Official source returned a non-JSON payload", response.status, response.url)
  return response.json() as Promise<T>
}
