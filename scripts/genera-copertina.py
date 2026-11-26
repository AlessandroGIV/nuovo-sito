#!/usr/bin/env python3
"""
Copertine del blog generate con IA, gratis, con gli spazi FLUX di Hugging Face.

Ogni articolo indica nel frontmatter
  coverPrompt  descrizione della scena in inglese (lo stile si aggiunge qui sotto)
  coverAlt     testo alternativo in italiano
Lo script genera l'immagine 1280x720, la salva in public/blog/<slug>.webp (sotto i 400 KB)
e scrive `cover: "/blog/<slug>.webp"` nel frontmatter.

Uso
  python3 scripts/genera-copertina.py              genera le copertine mancanti di tutti gli articoli
  python3 scripts/genera-copertina.py <slug>       rigenera quella di un articolo (anche se esiste)
  python3 scripts/genera-copertina.py <slug> 42    idem con un seed diverso

Gira in automatico nella GitHub Action `copertine` sulle PR che toccano content/posts.
Serve la variabile HF_TOKEN (token gratuito di Hugging Face, secret del repository) per avere la quota ZeroGPU
dell'account invece di quella anonima. Regole sul contenuto in content/LINEE-EDITORIALI.md.
"""
import os
import re
import sys
from pathlib import Path

from gradio_client import Client
from PIL import Image

POSTS = Path('content/posts')
OUT = Path('public/blog')
SPAZI = [
    ('mcp-tools/FLUX.1-Krea-dev', dict(guidance_scale=4.5, num_inference_steps=24)),
    ('evalstate/flux1_schnell', dict(num_inference_steps=4)),
]
STILE = (
    ' Editorial photography, warm amber light against deep navy blue tones, cinematic, high detail.'
    ' No text, no letters, no writing on the aircraft fuselage, no signs, no logos, no airline livery, no brand names, no recognizable faces.'
)


def frontmatter(testo: str) -> dict:
    m = re.match(r'^---\n(.*?)\n---\n', testo, re.S)
    campi = {}
    for riga in (m.group(1) if m else '').splitlines():
        k, _, v = riga.partition(':')
        campi[k.strip()] = v.strip().strip('"')
    return campi


def genera(prompt: str, seed: int) -> str:
    token = os.environ.get('HF_TOKEN') or None
    ultimo = None
    for spazio, extra in SPAZI:
        try:
            c = Client(spazio, token=token, verbose=False)
            res, _ = c.predict(prompt=prompt, seed=seed, randomize_seed=False, width=1280, height=720,
                               api_name='/infer', **extra)
            print(f'  generata con {spazio}')
            return res['path'] if isinstance(res, dict) else res
        except Exception as e:  # si prova lo spazio successivo
            ultimo = e
            print(f'  {spazio} non disponibile: {e}', file=sys.stderr)
    raise RuntimeError(f'nessuno spazio ha generato l\'immagine: {ultimo}')


def salva(sorgente: str, slug: str) -> Path:
    img = Image.open(sorgente).convert('RGB')
    w, h = img.size
    if w / h > 16 / 9:
        nw = int(h * 16 / 9)
        img = img.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w * 9 / 16)
        img = img.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    img = img.resize((1280, 720), Image.LANCZOS)
    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / f'{slug}.webp'
    for q in (82, 75, 68, 60):
        img.save(out, 'WEBP', quality=q, method=6)
        if out.stat().st_size <= 400 * 1024:
            break
    return out


def segna_cover(file: Path, slug: str) -> None:
    testo = file.read_text()
    riga = f'cover: "/blog/{slug}.webp"'
    if re.search(r'^cover:', testo, re.M):
        testo = re.sub(r'^cover:.*$', riga, testo, count=1, flags=re.M)
    else:
        testo = re.sub(r'^(coverPrompt:.*)$', riga + r'\n\1', testo, count=1, flags=re.M)
    file.write_text(testo)


def copertina(slug: str, seed: int = 261) -> bool:
    file = POSTS / f'{slug}.mdx'
    fm = frontmatter(file.read_text())
    if not fm.get('coverPrompt'):
        print(f'{slug} senza coverPrompt, salto')
        return False
    print(f'{slug}')
    out = salva(genera(fm['coverPrompt'] + STILE, seed), slug)
    segna_cover(file, slug)
    print(f'  {out} {out.stat().st_size // 1024} KB')
    return True


def main() -> None:
    if len(sys.argv) > 1:
        copertina(sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 261)
        return
    errori = 0
    for file in sorted(POSTS.glob('*.mdx')):
        slug = file.stem
        fm = frontmatter(file.read_text())
        if fm.get('coverPrompt') and not (OUT / f'{slug}.webp').exists():
            try:
                copertina(slug)
            except RuntimeError as e:
                errori += 1
                print(f'  {e}', file=sys.stderr)
    if errori:
        print(f'::warning::{errori} copertine non generate, vedi il log del passo precedente')


if __name__ == '__main__':
    main()
