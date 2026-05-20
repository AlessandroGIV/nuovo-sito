# LinkedIn — Coda pubblicazione manuale

LinkedIn non è connesso a Make.com. La pubblicazione va fatta manualmente seguendo questo workflow.

---

## Workflow per ogni post

1. **Apri il file `.md`** corrispondente alla data di pubblicazione
2. **Copia la caption** dal corpo del file (tutto il testo sotto il frontmatter)
3. **Carica il media** su LinkedIn:
   - `tipo: fotografica` → carica il file `.jpg` indicato in `immagine:`
   - `tipo: grafica` → carica il file `.jpg` indicato in `immagine:`
   - `tipo: carosello-pdf` → carica il file `.pdf` indicato in `immagine:` come **documento** (non come immagine)
4. **Incolla la caption** nel campo testo del post
5. **Pubblica**
6. **Aggiorna il frontmatter** del file: cambia `stato: "da pubblicare"` → `stato: "pubblicato"`

---

## Calendario

| Data | File | Tipo |
|------|------|------|
| 22 maggio 2026 | `2026-05-22-presentazione.md` | grafica — post di presentazione |
| 29 maggio 2026 | `2026-05-29-post_002.md` | fotografica |
| 5 giugno 2026 | `2026-06-05-post_004.md` | grafica |
| 12 giugno 2026 | `2026-06-12-post_006.md` | carosello PDF (5 slide) |
| 16 giugno 2026 | `2026-06-16-post_007.md` | fotografica |

---

## Note sul carosello PDF (12 giugno)

LinkedIn permette di caricare documenti PDF come post a scorrimento (equivalente del carosello).
Il file `images/2026-06-12-carosello.pdf` contiene le 5 slide nell'ordine corretto.
Caricarlo come **Documento** nella creazione del post (non come Immagine).

---

## Media

Tutti i file immagine sono in:
- `social/images/` — immagini condivise con la pipeline FB/IG automatica
- `social/linkedin/images/` — immagini esclusive LinkedIn (presentazione, PDF carosello)
