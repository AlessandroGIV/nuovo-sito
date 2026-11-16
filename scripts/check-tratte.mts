/**
 * Controllo dei dati delle pagine tratta senza passare dalla build di Next.
 * Importa i soli moduli privi di alias "@/": aeroporti e fonti. Le regole su soglie e duplicati
 * vivono in lib/seo/tratte.ts e fanno fallire la build se violate.
 */
import { aeroportiTratta } from '../lib/seo/aeroporti.ts'
import { fonti } from '../lib/seo/fonti.ts'

const errori: string[] = []

const slug = new Set<string>()
const iata = new Set<string>()
for (const a of aeroportiTratta) {
  if (slug.has(a.slug)) errori.push(`slug aeroporto duplicato: ${a.slug}`)
  if (iata.has(a.iata)) errori.push(`codice IATA duplicato: ${a.iata}`)
  slug.add(a.slug)
  iata.add(a.iata)
  if (!/^[A-Z]{3}$/.test(a.iata)) errori.push(`codice IATA non valido: ${a.iata}`)
  if (Math.abs(a.lat) > 90 || Math.abs(a.lon) > 180) errori.push(`coordinate non valide: ${a.iata}`)
}

for (const [id, f] of Object.entries(fonti)) {
  if (f.id !== id) errori.push(`fonte ${id}: il campo id non coincide con la chiave`)
  if (!['integrale', 'lexroom'].includes(f.stato)) errori.push(`fonte ${id}: stato "${f.stato}" non ammesso nelle pagine pubbliche`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f.verificataIl)) errori.push(`fonte ${id}: data di verifica mancante o malformata`)
  if (/da[- ]verificare|da confermare/i.test(f.estremi)) errori.push(`fonte ${id}: estremi incompleti`)
}

for (const e of errori) console.error(`ERRORE  ${e}`)
console.log(`${aeroportiTratta.length} aeroporti e ${Object.keys(fonti).length} fonti controllati, ${errori.length} errori`)
process.exit(errori.length ? 1 : 0)
