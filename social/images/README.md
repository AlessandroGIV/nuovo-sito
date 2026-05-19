# Immagini post social

Inserire qui le immagini dei post in formato JPG.
Il nome file deve corrispondere all'`image_url` in `posts.json`.

## Convenzione nomi

| File | Post | Formato | Note |
|------|------|---------|------|
| `post_001.jpg` | Sett.1 Mar | 1:1 (1024×1024) | Boarding pass + monete + smartphone |
| `post_002.jpg` | Sett.1 Ven | 16:9 (1280×720) | Scrivania con martelletto e documenti |
| `post_003.jpg` | Sett.2 Mar | 16:9 (1280×720) | Donna business in aeroporto |
| `post_004.jpg` | Sett.2 Ven | 1:1 (1024×1024) | Sfondo blu GIV, testo grande bianco |
| `post_005.jpg` | Sett.3 Mar | 16:9 (1280×720) | Uomo sereno tra passeggeri frustrati |
| `post_006.jpg` | Sett.3 Ven | 1:1 (1024×1024) | Carousel cover — sfondo bianco/blu |
| `post_007.jpg` | Sett.4 Mar | 16:9 (1280×720) | Coppia sorridente con notifica rimborso |
| `post_008.jpg` | Sett.4 Ven | 1:1 (1024×1024) | Grafica con domanda interattiva |

## Come aggiungere un'immagine

1. Esporta in JPG (qualità 85-90%)
2. Rinomina secondo la tabella sopra
3. Copia in questa cartella
4. Fai `git add` + `git commit` + `git push`
5. GitHub Raw URL usata in `posts.json`:
   `https://raw.githubusercontent.com/AlessandroGIV/nuovo-sito/main/social/images/<nome_file>.jpg`
