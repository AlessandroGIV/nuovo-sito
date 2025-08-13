import { NextResponse } from "next/server"

type SrcAirport = { iata?: string; icao?: string; name?: string; city?: string; country?: string }

// In-memory caches per cold start
let airportsCache: SrcAirport[] | null = null
const queryCache = new Map<string, SrcAirport[]>()

// Traduzione città italiane
const ITALIAN_CITIES: Record<string, string> = {
  rome: "Roma",
  Rome: "Roma",
  ROME: "Roma",
  milan: "Milano",
  Milan: "Milano",
  MILAN: "Milano",
  naples: "Napoli",
  Naples: "Napoli",
  florence: "Firenze",
  Florence: "Firenze",
  venice: "Venezia",
  Venice: "Venezia",
  turin: "Torino",
  Turin: "Torino",
  bologna: "Bologna",
  Bologna: "Bologna",
  palermo: "Palermo",
  Palermo: "Palermo",
  catania: "Catania",
  Catania: "Catania",
  bari: "Bari",
  Bari: "Bari",
  genoa: "Genova",
  Genoa: "Genova",
  pisa: "Pisa",
  Pisa: "Pisa",
  verona: "Verona",
  Verona: "Verona",
  trieste: "Trieste",
  Trieste: "Trieste",
  cagliari: "Cagliari",
  Cagliari: "Cagliari",
  olbia: "Olbia",
  Olbia: "Olbia",
  alghero: "Alghero",
  Alghero: "Alghero",
  brindisi: "Brindisi",
  Brindisi: "Brindisi",
  "reggio calabria": "Reggio Calabria",
  "Reggio Calabria": "Reggio Calabria",
  pescara: "Pescara",
  Pescara: "Pescara",
  ancona: "Ancona",
  Ancona: "Ancona",
  perugia: "Perugia",
  Perugia: "Perugia",
  rimini: "Rimini",
  Rimini: "Rimini",
  bergamo: "Bergamo",
  Bergamo: "Bergamo",
  treviso: "Treviso",
  Treviso: "Treviso",
  parma: "Parma",
  Parma: "Parma",
  foggia: "Foggia",
  Foggia: "Foggia",
  crotone: "Crotone",
  Crotone: "Crotone",
  trapani: "Trapani",
  Trapani: "Trapani",
  pantelleria: "Pantelleria",
  Pantelleria: "Pantelleria",
  lampedusa: "Lampedusa",
  Lampedusa: "Lampedusa",
  elba: "Elba",
  Elba: "Elba",
}

// Traduzione città europee dall'inglese all'italiano
const EUROPEAN_CITIES_IT: Record<string, string> = {
  // Regno Unito
  london: "Londra",
  London: "Londra",
  LONDON: "Londra",
  manchester: "Manchester",
  Manchester: "Manchester",
  birmingham: "Birmingham",
  Birmingham: "Birmingham",
  edinburgh: "Edimburgo",
  Edinburgh: "Edimburgo",
  glasgow: "Glasgow",
  Glasgow: "Glasgow",
  liverpool: "Liverpool",
  Liverpool: "Liverpool",
  bristol: "Bristol",
  Bristol: "Bristol",

  // Francia
  paris: "Parigi",
  Paris: "Parigi",
  PARIS: "Parigi",
  marseille: "Marsiglia",
  Marseille: "Marsiglia",
  lyon: "Lione",
  Lyon: "Lione",
  nice: "Nizza",
  Nice: "Nizza",
  toulouse: "Tolosa",
  Toulouse: "Tolosa",
  strasbourg: "Strasburgo",
  Strasbourg: "Strasburgo",
  bordeaux: "Bordeaux",
  Bordeaux: "Bordeaux",
  lille: "Lille",
  Lille: "Lille",

  // Germania
  munich: "Monaco di Baviera",
  Munich: "Monaco di Baviera",
  MUNICH: "Monaco di Baviera",
  berlin: "Berlino",
  Berlin: "Berlino",
  BERLIN: "Berlino",
  hamburg: "Amburgo",
  Hamburg: "Amburgo",
  cologne: "Colonia",
  Cologne: "Colonia",
  frankfurt: "Francoforte",
  Frankfurt: "Francoforte",
  stuttgart: "Stoccarda",
  Stuttgart: "Stoccarda",
  dusseldorf: "Düsseldorf",
  Dusseldorf: "Düsseldorf",
  düsseldorf: "Düsseldorf",
  Düsseldorf: "Düsseldorf",
  dresden: "Dresda",
  Dresden: "Dresda",
  nuremberg: "Norimberga",
  Nuremberg: "Norimberga",

  // Spagna
  madrid: "Madrid",
  Madrid: "Madrid",
  barcelona: "Barcellona",
  Barcelona: "Barcellona",
  seville: "Siviglia",
  Seville: "Siviglia",
  valencia: "Valencia",
  Valencia: "Valencia",
  bilbao: "Bilbao",
  Bilbao: "Bilbao",
  malaga: "Malaga",
  Malaga: "Malaga",
  málaga: "Malaga",
  Málaga: "Malaga",

  // Paesi Bassi
  amsterdam: "Amsterdam",
  Amsterdam: "Amsterdam",
  rotterdam: "Rotterdam",
  Rotterdam: "Rotterdam",
  "the hague": "L'Aia",
  "The Hague": "L'Aia",

  // Belgio
  brussels: "Bruxelles",
  Brussels: "Bruxelles",
  antwerp: "Anversa",
  Antwerp: "Anversa",

  // Austria
  vienna: "Vienna",
  Vienna: "Vienna",
  salzburg: "Salisburgo",
  Salzburg: "Salisburgo",
  innsbruck: "Innsbruck",
  Innsbruck: "Innsbruck",

  // Svizzera
  zurich: "Zurigo",
  Zurich: "Zurigo",
  geneva: "Ginevra",
  Geneva: "Ginevra",
  basel: "Basilea",
  Basel: "Basilea",
  bern: "Berna",
  Bern: "Berna",

  // Repubblica Ceca
  prague: "Praga",
  Prague: "Praga",

  // Ungheria
  budapest: "Budapest",
  Budapest: "Budapest",

  // Polonia
  warsaw: "Varsavia",
  Warsaw: "Varsavia",
  krakow: "Cracovia",
  Krakow: "Cracovia",
  cracow: "Cracovia",
  Cracow: "Cracovia",
  gdansk: "Danzica",
  Gdansk: "Danzica",

  // Portogallo
  lisbon: "Lisbona",
  Lisbon: "Lisbona",
  porto: "Porto",
  Porto: "Porto",

  // Grecia
  athens: "Atene",
  Athens: "Atene",
  thessaloniki: "Salonicco",
  Thessaloniki: "Salonicco",

  // Croazia
  zagreb: "Zagabria",
  Zagreb: "Zagabria",
  dubrovnik: "Dubrovnik",
  Dubrovnik: "Dubrovnik",

  // Slovenia
  ljubljana: "Lubiana",
  Ljubljana: "Lubiana",

  // Danimarca
  copenhagen: "Copenaghen",
  Copenhagen: "Copenaghen",

  // Svezia
  stockholm: "Stoccolma",
  Stockholm: "Stoccolma",
  gothenburg: "Göteborg",
  Gothenburg: "Göteborg",

  // Norvegia
  oslo: "Oslo",
  Oslo: "Oslo",
  bergen: "Bergen",
  Bergen: "Bergen",

  // Finlandia
  helsinki: "Helsinki",
  Helsinki: "Helsinki",

  // Irlanda
  dublin: "Dublino",
  Dublin: "Dublino",
  cork: "Cork",
  Cork: "Cork",

  // Romania
  bucharest: "Bucarest",
  Bucharest: "Bucarest",

  // Bulgaria
  sofia: "Sofia",
  Sofia: "Sofia",

  // Turchia (parte europea)
  istanbul: "Istanbul",
  Istanbul: "Istanbul",

  // Russia (parte europea)
  moscow: "Mosca",
  Moscow: "Mosca",
  "saint petersburg": "San Pietroburgo",
  "Saint Petersburg": "San Pietroburgo",
  "st petersburg": "San Pietroburgo",
  "St Petersburg": "San Pietroburgo",
}

// Dizionario inverso per ricerca bidirezionale (da italiano a inglese)
const EUROPEAN_CITIES_EN: Record<string, string[]> = {}
for (const [en, it] of Object.entries(EUROPEAN_CITIES_IT)) {
  const normalized = norm(it)
  if (!EUROPEAN_CITIES_EN[normalized]) {
    EUROPEAN_CITIES_EN[normalized] = []
  }
  EUROPEAN_CITIES_EN[normalized].push(en)
}

function norm(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
}

function isItalianCountry(country?: string): boolean {
  if (!country) return false
  const c = country.toLowerCase().trim()
  return c === "italy" || c === "italia" || c === "it" || c === "ita"
}

function isEuropeanCountry(country?: string): boolean {
  if (!country) return false
  const c = country.toLowerCase().trim()
  const europeanCountries = [
    "united kingdom",
    "uk",
    "gb",
    "great britain",
    "england",
    "scotland",
    "wales",
    "northern ireland",
    "france",
    "fr",
    "francia",
    "germany",
    "de",
    "deutschland",
    "germania",
    "spain",
    "es",
    "españa",
    "spagna",
    "netherlands",
    "nl",
    "holland",
    "paesi bassi",
    "belgium",
    "be",
    "belgio",
    "austria",
    "at",
    "switzerland",
    "ch",
    "svizzera",
    "czech republic",
    "cz",
    "repubblica ceca",
    "hungary",
    "hu",
    "ungheria",
    "poland",
    "pl",
    "polonia",
    "portugal",
    "pt",
    "portogallo",
    "greece",
    "gr",
    "grecia",
    "croatia",
    "hr",
    "croazia",
    "slovenia",
    "si",
    "denmark",
    "dk",
    "danimarca",
    "sweden",
    "se",
    "svezia",
    "norway",
    "no",
    "norvegia",
    "finland",
    "fi",
    "finlandia",
    "ireland",
    "ie",
    "irlanda",
    "romania",
    "ro",
    "bulgaria",
    "bg",
    "turkey",
    "tr",
    "turchia",
    "russia",
    "ru",
    "russian federation",
    "russia",
  ]
  return europeanCountries.includes(c)
}

function translateCity(city?: string, country?: string): string {
  if (!city) return ""

  // Prima controlla se è una città italiana
  if (isItalianCountry(country)) {
    if (ITALIAN_CITIES[city]) return ITALIAN_CITIES[city]
    const normalized = norm(city)
    return ITALIAN_CITIES[normalized] || city
  }

  // Poi controlla se è una città europea
  if (isEuropeanCountry(country)) {
    if (EUROPEAN_CITIES_IT[city]) return EUROPEAN_CITIES_IT[city]
    const normalized = norm(city)
    return EUROPEAN_CITIES_IT[normalized] || city
  }

  return city
}

function dedupe(list: SrcAirport[]): SrcAirport[] {
  const byIata = new Map<string, SrcAirport>()
  const result: SrcAirport[] = []

  for (const a of list) {
    const keyIata = a.iata?.toUpperCase()
    if (!keyIata) continue // Skip airports without IATA

    if (byIata.has(keyIata)) continue

    // Traduci le città
    const translatedCity = translateCity(a.city, a.country)

    const translated = { ...a, city: translatedCity }
    byIata.set(keyIata, translated)
    result.push(translated)
  }
  return result
}

async function loadAirports(): Promise<SrcAirport[]> {
  if (airportsCache) return airportsCache
  const [a1, a2] = await Promise.allSettled([
    // Array with iata, icao, name, city, country
    fetch("https://cdn.jsdelivr.net/npm/all-the-airports@4/airports.json", { cache: "no-store" }).then((r) =>
      r.ok ? (r.json() as Promise<SrcAirport[]>) : [],
    ),
    // Object keyed by ICAO: { "LIMC": {iata:"MXP", name, city, country } }
    fetch("https://cdn.jsdelivr.net/gh/mwgg/Airports@master/airports.json", { cache: "no-store" }).then(async (r) => {
      if (!r.ok) return [] as SrcAirport[]
      const obj = (await r.json()) as Record<string, any>
      const arr: SrcAirport[] = Object.entries(obj).map(([icao, v]) => ({
        iata: v?.iata,
        icao,
        name: v?.name,
        city: v?.city,
        country: v?.country,
      }))
      return arr
    }),
  ])

  const list1 = a1.status === "fulfilled" ? a1.value : []
  const list2 = a2.status === "fulfilled" ? a2.value : []
  const combined = dedupe([...list1, ...list2])

  // Filter: only airports with IATA code
  airportsCache = combined.filter((a) => a.iata && a.iata.length >= 3)
  return airportsCache
}

function containsIndex(hay?: string, needle?: string) {
  if (!hay || !needle) return -1
  return norm(hay).indexOf(norm(needle))
}

// Funzione per cercare anche nelle traduzioni inverse
function searchInTranslations(query: string, city?: string, country?: string): number {
  if (!city || !isEuropeanCountry(country)) return -1

  const normalizedQuery = norm(query)
  const normalizedCity = norm(city)

  // Cerca nelle traduzioni inverse (da italiano a inglese)
  const englishVariants = EUROPEAN_CITIES_EN[normalizedQuery] || []
  for (const englishVariant of englishVariants) {
    const index = containsIndex(englishVariant, normalizedQuery)
    if (index >= 0) return index
  }

  return -1
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") ?? "").trim()
  if (q.length < 2) {
    return NextResponse.json([], { headers: { "Cache-Control": "public, s-maxage=300" } })
  }

  const key = `v5:${q.toLowerCase()}`
  if (queryCache.has(key)) {
    return NextResponse.json(queryCache.get(key)!, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400" },
    })
  }

  const data = await loadAirports()
  const n = q

  // "contains" search on IATA, city, name
  type Ranked = SrcAirport & { _score: number; _pos: number }
  const ranked: Ranked[] = []

  for (const a of data) {
    const iIata = containsIndex(a.iata, n)
    const iCity = containsIndex(a.city, n)
    const iName = containsIndex(a.name, n)

    // Ricerca nelle traduzioni inverse (es. "londra" -> "london")
    const iCityTranslated = searchInTranslations(n, a.city, a.country)

    if (iIata === -1 && iCity === -1 && iName === -1 && iCityTranslated === -1) continue

    // Ranking migliorato:
    // 0: IATA exact match (es. "LHR" -> LHR)
    // 1: City starts with (es. "londra" -> Londra o "london" -> Londra)
    // 2: IATA contains (es. "lhr" -> LHR)
    // 3: Name starts with (es. "heathrow" -> Heathrow)
    // 4: City contains (es. "ondr" -> Londra)
    // 5: Name contains (es. "airport" -> London Heathrow Airport)

    let score = 6
    let pos = 9999

    if (iIata === 0) {
      score = 0
      pos = 0
    } else if (iCity === 0 || iCityTranslated === 0) {
      score = 1
      pos = 0
    } else if (iIata >= 0) {
      score = 2
      pos = iIata
    } else if (iName === 0) {
      score = 3
      pos = 0
    } else if (iCity >= 0 || iCityTranslated >= 0) {
      score = 4
      pos = Math.min(iCity >= 0 ? iCity : 9999, iCityTranslated >= 0 ? iCityTranslated : 9999)
    } else if (iName >= 0) {
      score = 5
      pos = iName
    }

    ranked.push({ ...a, _score: score, _pos: pos })
  }

  ranked.sort((a, b) => {
    if (a._score !== b._score) return a._score - b._score
    if (a._pos !== b._pos) return a._pos - b._pos
    const ac = (a.city || "").localeCompare(b.city || "")
    if (ac !== 0) return ac
    return (a.name || "").localeCompare(b.name || "")
  })

  const top = ranked.slice(0, 50).map(({ _score, _pos, ...rest }) => rest)

  queryCache.set(key, top)
  return NextResponse.json(top, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400" },
  })
}
