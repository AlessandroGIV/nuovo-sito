# Social Publisher — Giustizia In Volo

Pipeline di pubblicazione automatica su Facebook e Instagram tramite Make.com.

## Struttura

```
social/
├── posts.json           # Calendario post con caption, date e prompt immagini
├── publisher.py         # Invia i post schedulati al webhook Make (via GitHub Actions)
├── image_generator.py   # Genera le immagini con Gemini Imagen (esecuzione locale)
├── requirements.txt     # Dipendenze Python
└── images/
    ├── README.md        # Convenzione nomi file
    └── post_001.jpg     # Immagini generate (una per post)
```

## Generare le immagini del mese

Eseguire una volta prima che il primo post vada live.

**1. Installa le dipendenze:**
```bash
pip install -r social/requirements.txt
```

**2. Esporta la chiave API Gemini:**
```bash
export GEMINI_API_KEY="la-tua-chiave"
```
La chiave si ottiene su [aistudio.google.com](https://aistudio.google.com/app/apikey).

**3. Lancia il generatore:**
```bash
python social/image_generator.py
```

Lo script è **idempotente**: se un'immagine esiste già viene saltata, safe da rieseguire.

**4. Rivedi le immagini generate in `social/images/`**

**5. Se tutto ok, committa e pusha:**
```bash
git add social/images/
git commit -m "feat: immagini mese X"
git push
```

Le immagini devono essere su `main` prima della data di pubblicazione del primo post,
perché il publisher le referenzia tramite GitHub Raw URL.

---

## Aggiungere o modificare un post

Modifica `social/posts.json`:

| Campo | Descrizione |
|---|---|
| `id` | Identificatore univoco (`post_001`, `post_002`, …) |
| `scheduled_date` | Data pubblicazione `YYYY-MM-DD` |
| `scheduled_time` | Ora pubblicazione (solo documentativa, il cron gira alle 16:00 UTC) |
| `platforms` | Array: `facebook`, `instagram`, `linkedin` |
| `caption` | Testo del post con hashtag |
| `image_url` | URL raw GitHub dell'immagine |
| `image_prompt` | Prompt per Imagen 3 (usato da `image_generator.py`) |
| `image_aspect_ratio` | `1:1`, `16:9`, `4:3`, `9:16` |
| `published` | `false` → da pubblicare, `true` → già inviato al webhook |

---

## Come funziona il publisher automatico

GitHub Actions esegue `publisher.py` ogni giorno alle **16:00 UTC (18:00 ora italiana)**.

Il publisher:
1. Legge `posts.json`
2. Trova i post con `scheduled_date == oggi` e `published == false`
3. Invia una POST al webhook Make con `{ caption, image_url, platforms, … }`
4. Aggiorna `published: true` e fa commit automatico del JSON

Il secret `MAKE_WEBHOOK_URL` deve essere configurato in:
`github.com/AlessandroGIV/nuovo-sito → Settings → Secrets and variables → Actions`

Per un **test manuale** del workflow:
`GitHub → Actions → Social Publisher → Run workflow`
