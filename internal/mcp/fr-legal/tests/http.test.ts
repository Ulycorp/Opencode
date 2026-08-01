import test from "node:test"
import assert from "node:assert/strict"
import { assertOfficialUrl, fetchOfficial } from "../src/providers/http.ts"

function response(status: number, url: string, headers: Record<string, string> = {}, body = ""): Response {
  const value = new Response(body, { status, headers })
  Object.defineProperty(value, "url", { value: url })
  return value
}

test("official URL policies require HTTPS and approved hosts", () => {
  assert.equal(assertOfficialUrl("https://oauth.piste.gouv.fr/api/oauth/token", "piste-oauth").hostname, "oauth.piste.gouv.fr")
  assert.equal(assertOfficialUrl("https://www.cnil.fr/fr", "cnil").hostname, "www.cnil.fr")
  assert.throws(() => assertOfficialUrl("http://www.cnil.fr/fr", "cnil"), /must use HTTPS/)
  assert.throws(() => assertOfficialUrl("https://cnil.fr.evil.example/fr", "cnil"), /host is not approved/)
  assert.throws(() => assertOfficialUrl("https://api.piste.gouv.fr.evil.example/", "piste-api"), /host is not approved/)
  assert.throws(() => assertOfficialUrl("https://user:secret@www.cnil.fr/fr", "cnil"), /must not contain credentials/)
})

test("every redirect is validated before the next request", async () => {
  const originalFetch = globalThis.fetch
  const calls: string[] = []
  globalThis.fetch = async (input) => {
    calls.push(String(input))
    return response(302, String(input), { location: "https://attacker.example/collect" })
  }
  try {
    await assert.rejects(
      () => fetchOfficial("https://www.cnil.fr/fr/start", {}, "cnil"),
      /host is not approved/,
    )
    assert.deepEqual(calls, ["https://www.cnil.fr/fr/start"])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("authorized redirect chains remain usable", async () => {
  const originalFetch = globalThis.fetch
  const calls: string[] = []
  globalThis.fetch = async (input) => {
    const url = String(input)
    calls.push(url)
    if (calls.length === 1) return response(302, url, { location: "/fr/final" })
    return response(200, url, { "content-type": "text/plain" }, "ok")
  }
  try {
    const result = await fetchOfficial("https://www.cnil.fr/fr/start", {}, "cnil")
    assert.equal(await result.text(), "ok")
    assert.deepEqual(calls, ["https://www.cnil.fr/fr/start", "https://www.cnil.fr/fr/final"])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("PISTE credentials are never replayed to an unauthorized redirect host", async () => {
  const originalFetch = globalThis.fetch
  const calls: Array<{ url: string; body: unknown }> = []
  globalThis.fetch = async (input, init) => {
    calls.push({ url: String(input), body: init?.body })
    return response(307, String(input), { location: "https://attacker.example/token" })
  }
  try {
    const body = new URLSearchParams({ client_id: "client", client_secret: "top-secret" })
    await assert.rejects(
      () => fetchOfficial("https://oauth.piste.gouv.fr/api/oauth/token", { method: "POST", body }, "piste-oauth"),
      /host is not approved/,
    )
    assert.equal(calls.length, 1)
    assert.equal(calls[0].url, "https://oauth.piste.gouv.fr/api/oauth/token")
    assert.match(String(calls[0].body), /client_secret=top-secret/)
  } finally {
    globalThis.fetch = originalFetch
  }
})
