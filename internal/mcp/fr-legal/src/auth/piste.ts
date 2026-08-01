import { assertOfficialUrl, fetchJson } from "../providers/http.ts"

interface TokenResponse {
  access_token?: string
  expires_in?: number
  token_type?: string
  error?: string
  error_description?: string
}

let cached: { token: string; expiresAt: number } | null = null

function requireEnvironment(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`${name} is required for the Légifrance PISTE API`)
  return value
}

export function pisteConfiguration() {
  const tokenUrl = assertOfficialUrl(
    process.env.PISTE_TOKEN_URL || "https://oauth.piste.gouv.fr/api/oauth/token",
    "piste-oauth",
  )
  const apiBaseUrl = assertOfficialUrl(
    process.env.PISTE_API_BASE_URL || "https://api.piste.gouv.fr/dila/legifrance/lf-engine-app",
    "piste-api",
  )
  return {
    tokenUrl: tokenUrl.href,
    apiBaseUrl: apiBaseUrl.href.replace(/\/$/, ""),
    hasClientId: Boolean(process.env.PISTE_CLIENT_ID?.trim()),
    hasClientSecret: Boolean(process.env.PISTE_CLIENT_SECRET?.trim()),
  }
}

export async function getPisteToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token
  const clientId = requireEnvironment("PISTE_CLIENT_ID")
  const clientSecret = requireEnvironment("PISTE_CLIENT_SECRET")
  const { tokenUrl } = pisteConfiguration()
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "openid",
  })
  const response = await fetchJson<TokenResponse>(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  }, "piste-oauth")
  if (!response.access_token) throw new Error(`PISTE OAuth failed: ${response.error_description || response.error || "missing access_token"}`)
  const expiresIn = Number(response.expires_in || 300)
  cached = { token: response.access_token, expiresAt: Date.now() + Math.max(60, expiresIn) * 1_000 }
  return cached.token
}
