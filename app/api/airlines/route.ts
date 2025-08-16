import { NextResponse } from "next/server"

type Airline = { code?: string; name?: string; country?: string; iata?: string }

let airlinesCache: Airline[] | null = null
const queryCache = new Map<string, Airline[]>()

function norm(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
}

function dedupe(list: Airline[]): Airline[] {
  const byIata = new Map<string, Airline>()
  const byCode = new Map<string, Airline>()
  const res: Airline[] = []
  for (const a of list) {
    const ki = a.iata?.toUpperCase()
    const kc = a.code?.toUpperCase()
    if (ki) {
      if (byIata.has(ki)) continue
      byIata.set(ki, a)
      res.push(a)
      continue
    }
    if (kc) {
      if (byCode.has(kc)) continue
      byCode.set(kc, a)
      res.push(a)
      continue
    }
    const exists = res.find((r) => norm(r.name) === norm(a.name) && norm(r.country) === norm(a.country))
    if (!exists) res.push(a)
  }
  return res
}

async function loadAirlines(): Promise<Airline[]> {
  if (airlinesCache) return airlinesCache
  // Sorgente principale globale
  const res = await fetch("https://cdn.jsdelivr.net/gh/mwgg/Airlines@master/airlines.json", { cache: "no-store" })
  let list: Airline[] = []
  if (res.ok) {
    const raw = (await res.json()) as Record<string, { name?: string; country?: string; iata?: string }>
    list = Object.entries(raw).map(([code, a]) => ({
      code,
      name: a?.name ?? code,
      country: a?.country,
      iata: a?.iata,
    }))
  }
  // Fallback minimo (in caso di rete)
  if (!list.length) {
    list = [
      { code: "AZA", name: "ITA Airways", country: "Italy", iata: "AZ" },
      { code: "RYR", name: "Ryanair", country: "Ireland", iata: "FR" },
      { code: "EZY", name: "easyJet", country: "United Kingdom", iata: "U2" },
      { code: "DLH", name: "Lufthansa", country: "Germany", iata: "LH" },
      { code: "AFR", name: "Air France", country: "France", iata: "AF" },
      { code: "BAW", name: "British Airways", country: "United Kingdom", iata: "BA" },
    ]
  }
  airlinesCache = dedupe(list)
  return airlinesCache
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") ?? "").trim()
  if (q.length < 1) {
    return NextResponse.json([], { headers: { "Cache-Control": "public, s-maxage=300" } })
  }

  const key = q.toLowerCase()
  if (queryCache.has(key)) {
    return NextResponse.json(queryCache.get(key)!, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400" },
    })
  }

  const data = await loadAirlines()
  const n = norm(q)
  const starts = (s?: string) => (s ? norm(s).startsWith(n) : false)

  const filtered = data.filter((a) => starts(a.iata) || starts(a.code) || starts(a.name) || starts(a.country))
  filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""))

  const top = filtered.slice(0, 80)
  queryCache.set(key, top)

  return NextResponse.json(top, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400" },
  })
}
