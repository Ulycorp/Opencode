import type { LegalDocument, LegalSearchResult } from "../schemas/document.ts"
import { truncateText } from "../schemas/document.ts"
import { assertOfficialUrl, fetchOfficial } from "./http.ts"

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
}

function stripHtml(html: string): string {
  return decodeEntities(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  )
}

function officialCnilUrl(value: string, base: URL): URL {
  return assertOfficialUrl(new URL(value, base), "cnil")
}

function pageTitle(html: string): string {
  const meta = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
  const title = meta?.[1] || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "Publication CNIL"
  return stripHtml(title).replace(/\s*\|\s*CNIL\s*$/i, "")
}

function publishedDate(html: string): string | null {
  const value = html.match(/<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i)?.[1]
    || html.match(/<time[^>]+datetime=["']([^"']+)["']/i)?.[1]
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString()
}

export async function getCnilGuidance(urlValue: string): Promise<LegalDocument> {
  const url = officialCnilUrl(urlValue, new URL("https://www.cnil.fr/"))
  const response = await fetchOfficial(url, { headers: { Accept: "text/html" } }, "cnil")
  const html = await response.text()
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]
    || html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1]
    || html
  return {
    source: "cnil",
    document_id: url.pathname.replace(/^\/+|\/+$/g, "") || "homepage",
    title: pageTitle(html),
    status: "published",
    date: publishedDate(html),
    url: response.url,
    text: truncateText(stripHtml(main)),
    retrieved_at: new Date().toISOString(),
    document_type: "official_guidance",
  }
}

export async function searchCnil(query: string, limit = 10): Promise<LegalSearchResult> {
  const base = assertOfficialUrl(process.env.CNIL_SEARCH_BASE_URL || "https://www.cnil.fr/fr", "cnil")
  const searchUrl = new URL("recherche", base.href.endsWith("/") ? base : `${base.href}/`)
  searchUrl.searchParams.set("search_api_fulltext", query)
  const response = await fetchOfficial(searchUrl, { headers: { Accept: "text/html" } }, "cnil")
  const html = await response.text()
  const results: LegalDocument[] = []
  const seen = new Set<string>()
  for (const match of html.matchAll(/<a\b[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const title = stripHtml(match[2])
    if (title.length < 8 || title.length > 300) continue
    let url: URL
    try { url = officialCnilUrl(match[1], new URL(response.url)) } catch { continue }
    if (seen.has(url.href) || url.href === response.url || !url.pathname.startsWith("/fr/")) continue
    seen.add(url.href)
    results.push({
      source: "cnil",
      document_id: url.pathname.replace(/^\/+|\/+$/g, ""),
      title,
      status: "search_result_unverified",
      date: null,
      url: url.href,
      text: "",
      retrieved_at: new Date().toISOString(),
      document_type: "official_guidance_search_result",
    })
    if (results.length >= limit) break
  }
  return {
    source: "cnil",
    query,
    results,
    retrieved_at: new Date().toISOString(),
    limitation: "Résultats issus d'un fetch contrôlé de la recherche publique CNIL; appeler frlegal_cnil_get_guidance pour vérifier le contenu et la date.",
  }
}
