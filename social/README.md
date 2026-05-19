# Social Publisher — Giustizia In Volo

Pipeline di pubblicazione automatica su Facebook e Instagram tramite Make.com.

## Struttura

```
social/
├── posts.json              # Calendario post con caption, date e config immagine
├── publisher.py            # Invia i post schedulati al webhook Make (GitHub Actions)
├── image_generator.py      # Orchestratore: genera tutte le immagini del mese
├── graphic_generator.py    # Genera grafiche on-brand con Pillow (post testuali)
├── requirements.txt        # Dipendenze Python
└── images/
    ├── README.md           # Convenzione nomi file
    └── post_001.jpg        # Immagini generate (una per post)
```

---

## Due tipi di immagini

| Tipo | Quando usarlo | Tool |
|---|---|---|
| **Fotografico** (`image_prompt`) | Scene, persone, ambienti — post emozionali/empatici | Gemini Imagen 4 |
| **Grafico** (`graphic_template`) | Testo grande, infografiche, slide, domande — post educativi | Pillow (on-brand) |

Le immagini grafiche sono generate direttamente in Python con i colori e il font
estratti dal sito (`#072534` navy, `#FFC300` gold, `#F6F4EF` paper, Geist Sans).

### Template grafici disponibili

| Template | Layout | Uso tipico |
|---|---|---|
| `headline` | Titolo grande centrato su navy + pattern diagonale gold | "Hai 2 anni di tempo." |
| `list_cover` | Titolo su sfondo paper + barra navy sinistra + footer navy | "I 3 errori che ti fanno perdere il rimborso" |
| `question` | Domanda centrata su navy-medium + separatore gold | "Hai mai subito un disservizio aereo?" |

---

## Generare le immagini del mese

Eseguire **una volta** prima che il primo post vada live.
`image_generator.py` è idempotente: se un'immagine esiste viene saltata.

**1. Installa le dipendenze:**
```bash
pip install -r social/requirements.txt
```

**2. Esporta la chiave API Gemini** (serve solo per i post fotografici):
```bash
export GEMINI_API_KEY="la-tua-chiave"
```
La chiave si ottiene su [aistudio.google.com](https://aistudio.google.com/app/apikey).

**3. Lancia il generatore:**
```bash
python social/image_generator.py
```

Output atteso:
```
Image generator avviato — 8 post nel calendario

[IMAGEN]  post_001 — aspect 1:1...
          ✓ Salvato con watermark → post_001.jpg
[SKIP]    post_002 — già presente (post_002.jpg)
[GRAPHIC] post_004 — template 'headline'...
          ✓ Generato → post_004.jpg
...
Completato: 7 generate, 1 skippate, 0 fallite.
```

**4. Testa i template grafici** (senza API key):
```bash
python social/graphic_generator.py
```
Genera `social/images/_test_headline.jpg`, `_test_list_cover.jpg`, `_test_question.jpg`.

**5. Rivedi le immagini in `social/images/`**

**6. Committa e pusha:**
```bash
git add social/images/
git commit -m "feat: immagini mese X"
git push
```

Le immagini devono essere su `main` prima della data di pubblicazione del primo post,
perché il publisher le referenzia tramite GitHub Raw URL.

---

## Aggiungere o modificare un post

Modifica `social/posts.json`. Ogni post ha uno dei due setup:

**Post fotografico (Imagen):**
```json
{
  "id": "post_001",
  "image_prompt": "Descrizione in inglese dell'immagine per Imagen...",
  "image_aspect_ratio": "1:1",
  "add_watermark": true
}
```

**Post grafico (Pillow):**
```json
{
  "id": "post_004",
  "image_aspect_ratio": "1:1",
  "graphic_template": "headline",
  "graphic_content": {
    "accent": "Lo sapevi?",
    "title": "Hai 2 anni\\ndi tempo.",
    "subtitle": "per reclamare il rimborso del tuo volo"
  }
}
```

**Campi comuni a tutti i post:**

| Campo | Descrizione |
|---|---|
| `id` | Identificatore univoco (`post_001`, …) |
| `scheduled_date` | Data pubblicazione `YYYY-MM-DD` |
| `scheduled_time` | Ora documentativa (il cron gira alle 16:00 UTC) |
| `platforms` | Array: `facebook`, `instagram`, `linkedin` |
| `caption` | Testo del post con hashtag |
| `image_url` | URL raw GitHub dell'immagine |
| `image_aspect_ratio` | `1:1`, `16:9`, `4:5`, `9:16` |
| `published` | `false` → da pubblicare, `true` → già inviato |

---

## Come funziona il publisher automatico

GitHub Actions esegue `publisher.py` ogni giorno alle **16:00 UTC (18:00 ora italiana)**.

1. Legge `posts.json`
2. Trova i post con `scheduled_date == oggi` e `published == false`
3. Invia una POST al webhook Make con `{ caption, image_url, platforms, … }`
4. Aggiorna `published: true` e fa commit automatico del JSON

Il secret `MAKE_WEBHOOK_URL` va configurato in:
`github.com/AlessandroGIV/nuovo-sito → Settings → Secrets and variables → Actions`

Per un **test manuale** del workflow:
`GitHub → Actions → Social Publisher → Run workflow`
