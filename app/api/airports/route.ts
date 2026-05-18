import { NextResponse } from "next/server"
import { getClientIP, rateLimit } from "@/lib/rate-limit"
import airportsBundle from "@/lib/airports-bundle.json"

type Airport = { iata: string; name: string; city: string; country: string }

// Pre-loaded from local bundle — no external fetch needed
const AIRPORTS = airportsBundle as unknown as Airport[]

const queryCache = new Map<string, Airport[]>()

function norm(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase()
}

function containsIndex(hay?: string, needle?: string) {
  if (!hay || !needle) return -1
  return norm(hay).indexOf(norm(needle))
}

export async function GET(req: Request) {
  const ip = getClientIP(req)
  if (!rateLimit(`airports:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: "Troppe richieste. Riprova tra un minuto." }, { status: 429 })
  }

  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") ?? "").trim()
  if (q.length < 3) {
    return NextResponse.json([], { headers: { "Cache-Control": "public, s-maxage=300" } })
  }

  const key = `v6:${norm(q)}`
  if (queryCache.has(key)) {
    return NextResponse.json(queryCache.get(key)!, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400" },
    })
  }

  type Ranked = Airport & { _score: number; _pos: number }
  const ranked: Ranked[] = []

  for (const a of AIRPORTS) {
    const iIata = containsIndex(a.iata, q)
    const iCity = containsIndex(a.city, q)
    const iName = containsIndex(a.name, q)

    if (iIata === -1 && iCity === -1 && iName === -1) continue

    let score = 6
    let pos = 9999

    if (iIata === 0 && norm(a.iata) === norm(q)) {
      score = 0; pos = 0
    } else if (iCity === 0) {
      score = 1; pos = 0
    } else if (iIata >= 0) {
      score = 2; pos = iIata
    } else if (iName === 0) {
      score = 3; pos = 0
    } else if (iCity >= 0) {
      score = 4; pos = iCity
    } else if (iName >= 0) {
      score = 5; pos = iName
    }

    ranked.push({ ...a, _score: score, _pos: pos })
  }

  ranked.sort((a, b) => {
    if (a._score !== b._score) return a._score - b._score
    if (a._pos !== b._pos) return a._pos - b._pos
    return (a.city || "").localeCompare(b.city || "")
  })

  const top = ranked.slice(0, 50).map(({ _score, _pos, ...rest }) => rest)

  queryCache.set(key, top)
  return NextResponse.json(top, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400" },
  })
}
