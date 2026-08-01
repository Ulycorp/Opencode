export interface LegalDocument {
  source: "legifrance" | "bofip" | "cnil"
  document_id: string
  title: string
  status: string
  date: string | null
  url: string
  text: string
  retrieved_at: string
  document_type?: string
  metadata?: Record<string, unknown>
}

export interface LegalSearchResult {
  source: LegalDocument["source"]
  query: string
  results: LegalDocument[]
  retrieved_at: string
  limitation?: string
}

export function maxTextChars(): number {
  const parsed = Number(process.env.FR_LEGAL_MAX_TEXT_CHARS || 30_000)
  return Number.isFinite(parsed) && parsed >= 1_000 ? Math.min(parsed, 200_000) : 30_000
}

export function textFromUnknown(value: unknown): string {
  if (value === null || value === undefined) return ""
  if (typeof value === "string") return value
  if (Array.isArray(value)) return value.map(textFromUnknown).filter(Boolean).join("\n")
  if (typeof value === "object") {
    const object = value as Record<string, unknown>
    for (const key of ["text", "texte", "content", "contenu", "body", "nota", "resume", "description"]) {
      if (object[key]) return textFromUnknown(object[key])
    }
  }
  return ""
}

export function truncateText(value: string): string {
  const normalized = value.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim()
  const maximum = maxTextChars()
  return normalized.length <= maximum ? normalized : `${normalized.slice(0, maximum)}\n\n[TRUNCATED_BY_FR_LEGAL]`
}

export function firstString(object: Record<string, unknown>, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = object[key]
    if (typeof value === "string" && value.trim()) return value.trim()
    if (typeof value === "number") return String(value)
  }
  return fallback
}

export function normalizeDate(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value.trim() : parsed.toISOString()
}
