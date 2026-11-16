#!/usr/bin/env node
/**
 * Controllo dei contenuti del blog. Gira in CI su ogni PR e in locale con `npm run check`.
 * Blocca gli articoli che romperebbero il sito o violano le linee editoriali (content/LINEE-EDITORIALI.md).
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const ROOT = process.cwd()
const POSTS = path.join(ROOT, 'content/posts')
const CATEGORIE = ['guide', 'scioperi', 'compagnie', 'legale', 'casi', 'news']
const errori = []
const avvisi = []

/** Percorsi interni che esistono come cartelle statiche sotto app/ */
function rottaStatica(href) {
  const pulito = href.split('#')[0].split('?')[0].replace(/\/$/, '')
  if (pulito === '') return true
  return (
    fs.existsSync(path.join(ROOT, 'app', pulito, 'page.tsx')) ||
    fs.existsSync(path.join(ROOT, 'app', pulito, 'route.ts'))
  )
}

const slugPost = new Set(fs.readdirSync(POSTS).filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, '')))
const PREFISSI_DINAMICI = ['/voli/', '/compagnie-aeree/', '/aeroporti/', '/ec261/']

for (const file of fs.readdirSync(POSTS).filter((f) => f.endsWith('.mdx'))) {
  const dove = `content/posts/${file}`
  const { data, content } = matter(fs.readFileSync(path.join(POSTS, file), 'utf-8'))
  const err = (m) => errori.push(`${dove}  ${m}`)
  const avv = (m) => avvisi.push(`${dove}  ${m}`)

  for (const campo of ['title', 'description', 'date', 'slug', 'category', 'keywords', 'excerpt']) {
    if (data[campo] === undefined || data[campo] === '') err(`frontmatter senza "${campo}"`)
  }
  if (data.slug && `${data.slug}.mdx` !== file) err(`lo slug "${data.slug}" non coincide con il nome del file`)
  if (data.category && !CATEGORIE.includes(data.category)) err(`categoria "${data.category}" non prevista`)
  if (data.keywords && !Array.isArray(data.keywords)) err('"keywords" deve essere un elenco')
  if (data.date && Number.isNaN(new Date(data.date).getTime())) err(`data non valida: ${data.date}`)
  if (data.date && new Date(data.date).getTime() > Date.now() + 86400000) err(`data nel futuro: ${data.date}`)
  if (typeof data.description === 'string' && data.description.length > 160) {
    avv(`description di ${data.description.length} caratteri, Google la tronca oltre i 160`)
  }

  // Link interni
  for (const m of content.matchAll(/\]\((\/[^)\s]*)\)/g)) {
    const href = m[1]
    if (href.startsWith('/blog/')) {
      if (!slugPost.has(href.replace('/blog/', '').split('#')[0])) err(`link a un articolo che non esiste: ${href}`)
    } else if (PREFISSI_DINAMICI.some((p) => href.startsWith(p))) {
      // rotte dinamiche: le verifica la build (dynamicParams = false sulle pagine tratta)
    } else if (!rottaStatica(href)) {
      err(`link interno a una pagina che non esiste: ${href}`)
    }
  }

  // Ancore {#id} e link del sommario
  // Stessa regola di app/blog/[slug]/page.tsx: ancora esplicita {#id} oppure id ricavato dal titolo H2
  const idDaTitolo = (t) =>
    t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const ancore = new Set([...content.matchAll(/\{#([^}]+)\}/g)].map((m) => m[1]))
  for (const m of content.matchAll(/^## (.+?)(?:\s*\{#[^}]+\})?$/gm)) ancore.add(idDaTitolo(m[1]))
  for (const m of content.matchAll(/\]\(#([^)]+)\)/g)) {
    if (!ancore.has(m[1])) avv(`il sommario punta a #${m[1]} ma nessun titolo porta quell'ancora`)
  }

  // Articoli nuovi: sezione Fonti obbligatoria (i due articoli storici ne sono privi e vanno rivisti)
  if (data.date && new Date(data.date) >= new Date('2026-11-16') && !/^##\s+Fonti\b/m.test(content)) {
    err('manca la sezione "## Fonti" richiesta dalle linee editoriali')
  }

  // JSX non chiuso o caratteri che fanno fallire la compilazione MDX
  if (/<(?!\/?(a|br|strong|em|table|thead|tbody|tr|td|th|sup|sub|span|div|details|summary)\b)[A-Za-z]/.test(content)) {
    avv('contiene tag HTML o JSX non comuni, controllare che la pagina compili')
  }
}

for (const a of avvisi) console.log(`avviso  ${a}`)
for (const e of errori) console.error(`ERRORE  ${e}`)
console.log(`\n${slugPost.size} articoli controllati, ${errori.length} errori, ${avvisi.length} avvisi`)
process.exit(errori.length ? 1 : 0)
