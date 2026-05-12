import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

// Update this to the latest available Claude model
const MODEL = 'claude-sonnet-4-5'

type Category = 'guide' | 'scioperi' | 'compagnie' | 'legale' | 'casi' | 'news'

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  guide: ['come', 'guida', 'cosa', 'diritto', 'regolamento', 'spetta', 'funziona', 'sapere'],
  scioperi: ['sciopero', 'strike', 'agitazione', 'protesta'],
  compagnie: ['ryanair', 'easyjet', 'ita', 'airways', 'vueling', 'lufthansa', 'klm', 'wizzair', 'wizz', 'volotea', 'tap', 'iberia', 'compagnia'],
  legale: ['sentenza', 'tribunale', 'corte', 'giudice', 'legge', 'norma', 'giuridico', 'prescrizione', 'cassazione'],
  casi: ['storia', 'caso', 'esperienza', 'cliente', 'esempio', 'abbiamo', 'ottenuto'],
  news: ['luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre', 'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', '2024', '2025', '2026', 'aggiornamento', 'novità'],
}

function detectCategory(topic: string): Category {
  const lower = topic.toLowerCase()
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return cat as Category
  }
  return 'guide'
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

const SYSTEM_PROMPT = `Sei un redattore legale specializzato in diritti dei passeggeri aerei per Giustizia In Volo (GIV), studio legale italiano.

REGOLE ASSOLUTE:
- Non inventare mai nomi di avvocati, giudici o persone reali
- Nelle storie di casi, usa sempre nomi fittizi generici (es. "un nostro cliente", "una famiglia di 4 persone") o anonimizza completamente
- Cita sentenze e normative reali solo se sei sicuro che esistano (Reg. CE 261/2004, CGUE C-549/07 Wallentin-Hermann, Cass. n. 1584/2018)

TONO E STILE:
- Autorevole ma accessibile. Parla come un avvocato che spiega a un cliente, non come un chatbot
- Usa "hai diritto a" (non "potresti avere diritto a")
- Evita formule burocratiche
- Italiano corretto, diretto, orientato all'azione

STRUTTURA OBBLIGATORIA:
1. Frontmatter YAML completo (title, description max 150 chars, date oggi, slug, category, keywords array, excerpt 2 righe)
2. H1 con keyword principale
3. Intro 100-150 parole che aggancia lo scenario del lettore
4. Sommario/indice cliccabile (per articoli >1000 parole)
5. Corpo con H2/H3
6. Box "## In sintesi" con 4-5 bullet (ottimizza featured snippet Google)
7. Sezione "## Domande frequenti" con 4-5 Q&A (ottimizza People Also Ask)
8. CTA: "Hai subito un disservizio aereo? [Verifica gratis in 2 minuti →](/richiesta)"

OUTPUT: solo il file MDX completo, nient'altro. Inizia direttamente con --- (frontmatter YAML).`

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Uso: npx ts-node scripts/generate-post.ts "titolo o tema" [--category <categoria>]')
    process.exit(1)
  }

  const categoryFlagIdx = args.indexOf('--category')
  let category: Category | undefined
  let topicArgs = [...args]

  if (categoryFlagIdx !== -1) {
    category = args[categoryFlagIdx + 1] as Category
    topicArgs = args.filter((_, i) => i !== categoryFlagIdx && i !== categoryFlagIdx + 1)
  }

  const topic = topicArgs.join(' ')
  const detectedCategory = category ?? detectCategory(topic)
  const today = new Date().toISOString().split('T')[0]

  console.log(`\n📝 Generazione articolo: "${topic}"`)
  console.log(`📂 Categoria: ${detectedCategory}`)

  const client = new Anthropic()

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Scrivi un articolo completo (1800–2200 parole) per il blog di Giustizia In Volo sul seguente tema:\n\n"${topic}"\n\nCategoria: ${detectedCategory}\nData di oggi: ${today}`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    console.error('Risposta inattesa dall\'API')
    process.exit(1)
  }

  let mdxContent = content.text.trim()

  // Extract slug from frontmatter, fallback to topic
  const slugMatch = mdxContent.match(/^slug:\s*["']?([^"'\n]+)["']?$/m)
  const slug = slugMatch ? slugMatch[1].trim() : toSlug(topic)

  const postsDir = path.join(process.cwd(), 'content/posts')
  if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true })

  const filePath = path.join(postsDir, `${slug}.mdx`)
  fs.writeFileSync(filePath, mdxContent, 'utf-8')

  console.log(`\n✅ File salvato: content/posts/${slug}.mdx`)

  // Extract title from frontmatter for commit message
  const titleMatch = mdxContent.match(/^title:\s*["']?(.+?)["']?$/m)
  const title = titleMatch ? titleMatch[1] : topic

  try {
    execSync(`git add content/posts/${slug}.mdx`, { stdio: 'inherit' })
    execSync(`git commit -m "blog: aggiungi ${title}"`, { stdio: 'inherit' })
    execSync('git push', { stdio: 'inherit' })
    console.log(`\n✅ Articolo pubblicato: ${title} → Vercel deploya in ~60s`)
  } catch {
    console.log(`\n⚠️  Git push fallito. Il file è stato salvato localmente: content/posts/${slug}.mdx`)
    console.log('Puoi fare il push manualmente con: git add content/posts/' + slug + '.mdx && git commit -m "blog: aggiungi ' + title + '" && git push')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
