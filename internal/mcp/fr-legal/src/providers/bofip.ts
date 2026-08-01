import type { LegalDocument, LegalSearchResult } from "../schemas/document.ts"
import { firstString, normalizeDate, textFromUnknown, truncateText } from "../schemas/document.ts"
import { assertOfficialUrl, fetchJson, SourceHttpError } from "./http.ts"

type JsonObject = Record<string, unknown>
interface DatasetResponse { results?: JsonObject[]; total_count?: number }

function recordsUrl(): URL {
  const base = assertOfficialUrl(
    process.env.BOFIP_DATASET_API_URL || "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets",
    "bofip-data",
  )
  base.search = ""
  base.hash = ""
  return new URL(`${base.href.replace(/\/$/, "")}/bofip-vigueur/records`)
}

function escapeWhere(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"')
}

function normalize(record: JsonObject): LegalDocument {
  const id = firstString(record, ["identifiant", "id", "recordid", "numero", "reference"], "unknown")
  const title = firstString(record, ["titre", "title", "intitule", "libelle", "description"], `BOFiP ${id}`)
  const date = normalizeDate(firstString(record, ["date_de_publication", "date_publication", "date", "modified", "derniere_modification"]))
  const fallbackUrl = `https://bofip.impots.gouv.fr/bofip/recherche?query=${encodeURIComponent(id)}`
  const candidateUrl = firstString(
    record,
    ["url", "lien", "uri"],
    fallbackUrl,
  )
  const url = (() => {
    try { return assertOfficialUrl(candidateUrl, "bofip-public").href } catch {}
    try { return assertOfficialUrl(candidateUrl, "bofip-data").href } catch {}
    return fallbackUrl
  })()
  return {
    source: "bofip",
    document_id: id,
    title,
    status: firstString(record, ["statut", "status", "etat"], "in_force_dataset"),
    date,
    url,
    text: truncateText(textFromUnknown(record)),
    retrieved_at: new Date().toISOString(),
    document_type: "administrative_doctrine",
    metadata: {
      dataset: "bofip-vigueur",
      serie: record.serie ?? null,
      plan_classement: record.plan_classement ?? null,
    },
  }
}

async function getRecords(url: URL): Promise<JsonObject[]> {
  const payload = await fetchJson<DatasetResponse>(url, {}, "bofip-data")
  return Array.isArray(payload.results) ? payload.results : []
}

export async function searchBofip(query: string, limit = 10): Promise<LegalSearchResult> {
  const url = recordsUrl()
  url.searchParams.set("limit", String(Math.min(Math.max(limit, 1), 50)))
  url.searchParams.set("where", `search(*, "${escapeWhere(query)}")`)
  let records: JsonObject[]
  try {
    records = await getRecords(url)
  } catch (error) {
    if (!(error instanceof SourceHttpError) || error.status !== 400) throw error
    const fallback = recordsUrl()
    fallback.searchParams.set("limit", "100")
    const needle = query.toLocaleLowerCase("fr")
    records = (await getRecords(fallback)).filter((record) => JSON.stringify(record).toLocaleLowerCase("fr").includes(needle)).slice(0, limit)
  }
  return {
    source: "bofip",
    query,
    results: records.slice(0, limit).map(normalize),
    retrieved_at: new Date().toISOString(),
    limitation: "Doctrine administrative issue du jeu officiel bofip-vigueur; vérifier le document et sa version sur BOFiP.",
  }
}

export async function getBofip(documentId: string): Promise<LegalDocument> {
  const search = await searchBofip(documentId, 25)
  const exact = search.results.find((document) => document.document_id.toLocaleLowerCase("fr") === documentId.toLocaleLowerCase("fr"))
  if (!exact) throw new Error(`BOFiP document not found in official dataset: ${documentId}`)
  return exact
}

export async function recentBofip(limit = 10): Promise<LegalSearchResult> {
  const url = recordsUrl()
  url.searchParams.set("limit", String(Math.min(Math.max(limit * 5, 20), 100)))
  const records = await getRecords(url)
  const documents = records.map(normalize).sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))).slice(0, limit)
  return {
    source: "bofip",
    query: "recent",
    results: documents,
    retrieved_at: new Date().toISOString(),
    limitation: "Tri local par la meilleure date disponible dans le jeu officiel.",
  }
}
