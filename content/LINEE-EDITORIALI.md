# Linee editoriali dei contenuti GIV

Regole per chi scrive o aggiorna contenuti del sito, persone e agenti automatici. Valgono per il blog (`content/posts`) e per le pagine tratta (`lib/seo`).

## 1. Fonti

1. Si cita solo ciò che è registrato in `lib/seo/fonti.ts` oppure nell'archivio giv-giurisprudenza con stato `verificato`.
2. Stati ammessi nelle pagine pubbliche
   - `integrale` — testo completo letto, da EUR-Lex per normativa e Corte di giustizia o da scheda `verificato` dell'archivio
   - `lexroom` — estremi e passaggi verificati sulla ricerca Lexroom
3. Le schede `da-verificare`, quelle con annotazioni del tipo «numero di causa da verificare» o «data da verificare» e le pronunce ricordate a memoria non si pubblicano. Mai.
4. Organo, sezione, data e numero si copiano dalla scheda o dall'intestazione della pronuncia. Non si ricostruiscono.
5. Se un tema non ha copertura, il testo si ferma alla norma e la lacuna si segnala nella PR come richiesta di ricerca Lexroom.
6. Le sentenze della Corte di giustizia si possono leggere per intero su EUR-Lex. Dopo la lettura si registrano in `lib/seo/fonti.ts` con stato `integrale`, URL e data.

## 2. Affermazioni

- Niente numeri sull'attività di GIV (pratiche gestite, percentuali di successo, anni di esperienza) e niente casi di clienti, veri o di fantasia, salvo dati forniti da Alessandro per quell'articolo.
- Niente promesse di risultato. Si scrive «puoi avere diritto» quando il diritto dipende da condizioni, «hai diritto» solo quando la norma lo attribuisce senza condizioni.
- Importi e soglie si scrivono con l'articolo del regolamento che li prevede.
- Sui termini per agire si riporta il quadro di `lib/seo/disservizi.ts` (sezione «Entro quando agire»). Non si scrive «3 anni».
- Dove la giurisprudenza è divisa lo si dice.
- Nessun giudizio sui vettori che non sia sorretto da una fonte.

## 3. Articoli del blog

- Un file `.mdx` in `content/posts`, nome del file uguale allo `slug`.
- Frontmatter con `title`, `description` (fino a 160 caratteri), `date` tra virgolette in formato AAAA-MM-GG, `slug`, `category` (guide, scioperi, compagnie, legale, casi, news), `keywords`, `excerpt`.
- Nessun titolo H1 nel corpo, lo genera la pagina. Sezioni con `##`.
- Chiusura con `## Domande frequenti` e poi `## Fonti`, con gli estremi completi di ogni norma e pronuncia citata. La sezione Fonti è obbligatoria e il controllo automatico la pretende.
- Almeno due link interni verso pagine esistenti (`/voli/...`, `/compagnie-aeree/...`, `/ec261/...`, altri articoli) e un invito finale verso `/richiesta`.
- Lunghezza tra 900 e 1.800 parole. Meglio un articolo corto e fondato che uno lungo e generico.
- Prima di aprire la PR si esegue `npm run check`.

## 4. Pagine tratta

- Le tratte stanno in `lib/seo/tratte.ts`. Si aggiunge una tratta solo dopo averla riscontrata su una fonte pubblica datata (operativo del vettore, sito dell'aeroporto, elenco destinazioni). Niente tratte a memoria, niente stagionali fuori stagione.
- Il testo giuridico sta in `lib/seo/disservizi.ts`. Ogni paragrafo porta le sue fonti.
- Le tratte a meno di 40 km dalla soglia dei 1.500 km non si pubblicano, perché l'importo non sarebbe certo. La build le rifiuta.
- Quando si ricontrolla il lotto si aggiorna `VERIFICA_TRATTE.data`.

## 5. Pubblicazione

- Ogni modifica arriva con una pull request, mai con push diretto su `main`.
- Una PR per argomento. La descrizione elenca le fonti usate, le lacune trovate e i punti sui quali serve una decisione di Alessandro.
