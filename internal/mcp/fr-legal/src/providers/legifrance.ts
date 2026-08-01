import { getPisteToken, pisteConfiguration } from "../auth/piste.ts"
import type { LegalDocument, LegalSearchResult } from "../schemas/document.ts"
import { firstString, normalizeDate, textFromUnknown, truncateText } from "../schemas/document.ts"
import { assertOfficialUrl, fetchJson } from "./http.ts"

type JsonObject = Record<string, unknown>

async function pistePost(route: string, body: JsonObject): Promise<unknown> {
  const token = await getPisteToken()
  const { apiBaseUrl } = pisteConfiguration()
  return fetchJson(`${apiBaseUrl}/${route.replace(/^\//, "")}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }, "piste-api")
}

function asObject(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : {}
}

function resultItems(payload: unknown): JsonObject[] {
  const root = asObject(payload)
  const candidates: unknown[] = [root.results, root.result, root.content, root.documents, root.articles]
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      const direct = candidate.filter((item) => item && typeof item === "object") as JsonObject[]
      if (direct.length === 1) {
        const nested = asObject(direct[0])
        for (const key of ["titles", "articles", "documents", "results"]) {
          if (Array.isArray(nested[key])) return (nested[key] as unknown[]).map(asObject)
        }
      }
      return direct
    }
  }
  return Object.keys(root).length ? [root] : []
}

function legifranceUrl(id: string, kind: string): string {
  const encoded = encodeURIComponent(id)
  if (kind === "article") return `https://www.legifrance.gouv.fr/codes/article_lc/${encoded}`
  if (kind === "jurisprudence") return `https://www.legifrance.gouv.fr/juri/id/${encoded}`
  return `https://www.legifrance.gouv.fr/loda/id/${encoded}`
}

function officialLegifranceUrl(value: string, fallback: string): string {
  try {
    return assertOfficialUrl(value, "legifrance").href
  } catch {
    return fallback
  }
}

function normalize(item: JsonObject, kind: string, fallbackId = "unknown"): LegalDocument {
  const id = firstString(item, ["id", "textId", "cid", "articleId", "num", "numero"], fallbackId)
  const title = firstString(item, ["title", "titre", "titleLong", "nature", "nomCode", "num"], `Document Légifrance ${id}`)
  const status = firstString(item, ["status", "etat", "etatJuridique", "juridicalStatus"], "unknown")
  const date = normalizeDate(firstString(item, ["date", "dateTexte", "datePublication", "dateDecision", "dateDebut", "dateVersion"]))
  const fallbackUrl = legifranceUrl(id, kind)
  const url = officialLegifranceUrl(firstString(item, ["url", "uri"], fallbackUrl), fallbackUrl)
  return {
    source: "legifrance",
    document_id: id,
    title,
    status,
    date,
    url,
    text: truncateText(textFromUnknown(item)),
    retrieved_at: new Date().toISOString(),
    document_type: kind,
    metadata: {
      nature: item.nature ?? null,
      origine: item.origine ?? null,
      numero: item.num ?? item.numero ?? null,
    },
  }
}

function searchBody(query: string, fund: string, limit: number): JsonObject {
  return {
    recherche: {
      champs: [{
        typeChamp: "ALL",
        criteres: [{ typeRecherche: "UN_DES_MOTS", valeur: query, operateur: "ET" }],
        operateur: "ET",
      }],
      filtres: [],
      pageNumber: 1,
      pageSize: limit,
      sort: "PERTINENCE",
      typePagination: "DEFAUT",
    },
    fond: fund,
  }
}

export async function searchLaw(query: string, limit = 10): Promise<LegalSearchResult> {
  const payload = await pistePost("search", searchBody(query, "LODA_DATE", limit))
  return {
    source: "legifrance",
    query,
    results: resultItems(payload).slice(0, limit).map((item) => normalize(item, "law")),
    retrieved_at: new Date().toISOString(),
  }
}

export async function searchJurisprudence(query: string, limit = 10): Promise<LegalSearchResult> {
  const payload = await pistePost("search", searchBody(query, "JURI", limit))
  return {
    source: "legifrance",
    query,
    results: resultItems(payload).slice(0, limit).map((item) => normalize(item, "jurisprudence")),
    retrieved_at: new Date().toISOString(),
  }
}

export async function getArticle(articleId: string): Promise<LegalDocument> {
  const payload = await pistePost("consult/getArticle", { id: articleId })
  const root = asObject(payload)
  return normalize(asObject(root.article || payload), "article", articleId)
}

export async function getCode(codeId: string, date?: string): Promise<LegalDocument> {
  const payload = await pistePost("consult/getCode", { textId: codeId, date: date || new Date().toISOString().slice(0, 10) })
  const root = asObject(payload)
  return normalize(asObject(root.code || root.texte || payload), "code", codeId)
}

export async function getDocument(documentId: string, kind: "law" | "article" | "code" | "jurisprudence" = "law"): Promise<LegalDocument> {
  if (kind === "article") return getArticle(documentId)
  if (kind === "code") return getCode(documentId)
  const route = kind === "jurisprudence" ? "consult/getJuri" : "consult/getLoda"
  const payload = await pistePost(route, { textId: documentId })
  const root = asObject(payload)
  return normalize(asObject(root.texte || root.text || root.juri || payload), kind, documentId)
}
