#!/usr/bin/env python3
"""
Genera immagini grafiche on-brand per Giustizia In Volo usando Pillow.

Brand identity estratta da app/globals.css e components/ del sito Next.js:

  PALETTE (colori esatti dal CSS)
    NAVY_DEEP  #072534 — bg header, footer, cover principale
    NAVY_MED   #0E3A52 — bg alternativo (class band-alt / cover-stripes)
    GOLD       #FFC300 — accento primario: logo, CTA, link, bullet ◆
    ORANGE     #FF8A00 — accento secondario (bottone "Richiedi rimborso")
    PAPER      #F6F4EF — sfondo chiaro (class band-paper)
    WHITE      #FFFFFF — testo su dark, card background

  TYPOGRAPHY (da @theme inline e .prose-on-paper in globals.css)
    Font: Geist Sans — caricato da node_modules/geist/dist/fonts/geist-sans/
      Geist-UltraBlack.ttf — h1/titoli grandi (font-weight 800, letter-spacing -0.02em)
      Geist-Black.ttf       — titoli medi
      Geist-Bold.ttf        — sottotitoli (h3: weight 700, ls -0.015em)
      Geist-SemiBold.ttf    — label, footer brand
      Geist-Medium.ttf      — corpo enfatico
    Fallback: /System/Library/Fonts/Helvetica.ttc (macOS) → Arial.ttf → PIL default

  VISUAL STYLE
    Border radius: 0.625rem (10px) — --radius in globals.css
    Bullet: rombo ◆ gold ruotato 45° — .prose-on-paper ul li::before
    Pattern bg: linee diagonali sottili — .cover-stripes / .cover-deep classes
    Tono: corporate-minimal, dark navy + gold, pulito e professionale
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# ── Palette ────────────────────────────────────────────────────────────────────
NAVY_DEEP = (7,   37,  52)   # #072534
NAVY_MED  = (14,  58,  82)   # #0E3A52
GOLD      = (255, 195,  0)   # #FFC300
PAPER     = (246, 244, 239)  # #F6F4EF
WHITE     = (255, 255, 255)
# Pre-blended approx. per testo "muted" (evita RGBA draw su RGB img)
GOLD_DIM  = (245, 175,  10)  # gold leggermente smorzato per sottotitoli su scuro
NAVY_DIM  = ( 85, 105, 118)  # navy smorzato per sottotitoli su paper

# ── Font ───────────────────────────────────────────────────────────────────────
_REPO   = Path(__file__).parent.parent
_GEIST  = _REPO / "node_modules/geist/dist/fonts/geist-sans"
_FONT_MAP = {
    "ultrablack": _GEIST / "Geist-UltraBlack.ttf",
    "black":      _GEIST / "Geist-Black.ttf",
    "bold":       _GEIST / "Geist-Bold.ttf",
    "semibold":   _GEIST / "Geist-SemiBold.ttf",
    "medium":     _GEIST / "Geist-Medium.ttf",
    "regular":    _GEIST / "Geist-Regular.ttf",
}
_SYS_FALLBACKS = ["/System/Library/Fonts/Helvetica.ttc", "Arial.ttf"]

def _font(weight: str, size: int) -> ImageFont.FreeTypeFont:
    for path in [_FONT_MAP.get(weight, _FONT_MAP["regular"]), *_SYS_FALLBACKS]:
        try:
            return ImageFont.truetype(str(path), size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()

# ── Canvas / layout ────────────────────────────────────────────────────────────
DIMS = {"1:1": (1080, 1080), "4:5": (1080, 1350)}

def _canvas(aspect_ratio: str, bg: tuple) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    w, h = DIMS.get(aspect_ratio, (1080, 1080))
    img = Image.new("RGB", (w, h), bg)
    return img, ImageDraw.Draw(img)

def _text_w(text: str, font) -> float:
    """Larghezza testo — compatibile con Pillow ≥9."""
    try:
        return font.getlength(text)
    except AttributeError:
        return font.getsize(text)[0]

def _wrap(text: str, font, max_w: int) -> list[str]:
    """Word wrap su max_w pixel. Rispetta '\\n' passato come char letterale."""
    lines, cur = [], ""
    for word in text.split():
        test = (cur + " " + word).strip()
        if _text_w(test, font) > max_w and cur:
            lines.append(cur)
            cur = word
        else:
            cur = test
    if cur:
        lines.append(cur)
    return lines or [""]

def _wrap_multiline(text: str, font, max_w: int) -> list[str]:
    """Wrappa rispettando \\n espliciti nel testo (per a-capo forzati nel content)."""
    result = []
    for segment in text.split("\\n"):
        result.extend(_wrap(segment, font, max_w) if segment.strip() else [""])
    return result

# ── Primitive decorative ───────────────────────────────────────────────────────
def _diamond(draw: ImageDraw.ImageDraw, cx: int, cy: int, r: int, color=GOLD):
    """Rombo ◆ — bullet del brand (da .prose-on-paper ul li::before, rotated 45°)."""
    draw.polygon([(cx, cy - r), (cx + r, cy), (cx, cy + r), (cx - r, cy)], fill=color)

def _apply_stripes(img: Image.Image, color: tuple, alpha: int, step: int) -> Image.Image:
    """
    Overlay diagonale che riproduce .cover-stripes e .cover-deep di globals.css.
    Usa RGBA compositing su layer separato per mantenere l'immagine base RGB.
    """
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for i in range(-h, w + h, step):
        d.line([(i, 0), (i + h, h)], fill=(*color, alpha), width=2)
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

def _footer_dark(draw: ImageDraw.ImageDraw, w: int, h: int, footer_h: int):
    """Footer con barra gold + 'giustiziainvolo.it' centrato in gold."""
    bar_y = h - footer_h
    bar_h = max(3, int(h * 0.004))
    draw.rectangle([0, bar_y, w, bar_y + bar_h], fill=GOLD)
    f = _font("semibold", int(h * 0.028))
    text = "giustiziainvolo.it"
    tw = _text_w(text, f)
    bx = draw.textbbox((0, 0), text, font=f)
    th = bx[3] - bx[1]
    ty = bar_y + bar_h + (footer_h - bar_h - th) // 2
    draw.text((int((w - tw) // 2), ty), text, fill=GOLD, font=f)


# ── Template: headline ─────────────────────────────────────────────────────────
def _template_headline(content: dict, output_path: str, aspect_ratio: str):
    """
    Sfondo NAVY_DEEP + pattern diagonale gold, titolo grande centrato, sottotitolo, footer.
    Uso tipico: "Hai 2 anni di tempo." (post_004)

    content:
      title    — testo grande (usa \\n per a-capo forzati)
      subtitle — riga più piccola sotto il titolo (opzionale)
      accent   — label piccola sopra il titolo, es. "Lo sapevi?" (opzionale)
    """
    img, draw = _canvas(aspect_ratio, NAVY_DEEP)
    w, h = img.size
    img = _apply_stripes(img, GOLD, 28, 20)
    draw = ImageDraw.Draw(img)

    pad = int(w * 0.08)
    max_w = w - pad * 2
    footer_h = int(h * 0.12)
    y = int(h * 0.09)

    # Rombo decorativo in alto centrato
    _diamond(draw, w // 2, y, int(w * 0.018))
    y += int(h * 0.065)

    # Accent label opzionale
    accent = content.get("accent", "")
    if accent:
        f_acc = _font("semibold", int(h * 0.030))
        aw = _text_w(accent, f_acc)
        draw.text(((w - aw) // 2, y), accent, fill=GOLD, font=f_acc)
        y += int(h * 0.055)

    # Titolo principale
    f_title = _font("ultrablack", int(h * 0.098))
    for line in _wrap_multiline(content["title"], f_title, max_w):
        if not line:
            y += int(h * 0.04)
            continue
        bx = draw.textbbox((0, 0), line, font=f_title)
        lw, lh = bx[2] - bx[0], bx[3] - bx[1]
        draw.text(((w - lw) // 2, y), line, fill=WHITE, font=f_title)
        y += int(lh * 1.05)

    # Sottotitolo opzionale
    subtitle = content.get("subtitle", "")
    if subtitle:
        y += int(h * 0.028)
        f_sub = _font("medium", int(h * 0.038))
        for line in _wrap(subtitle, f_sub, max_w):
            lw = _text_w(line, f_sub)
            draw.text(((w - lw) // 2, y), line, fill=GOLD_DIM, font=f_sub)
            bx = draw.textbbox((0, 0), line, font=f_sub)
            y += int((bx[3] - bx[1]) * 1.3)

    _footer_dark(draw, w, h, footer_h)
    img.save(output_path, "JPEG", quality=95)


# ── Template: list_cover ───────────────────────────────────────────────────────
def _template_list_cover(content: dict, output_path: str, aspect_ratio: str):
    """
    Sfondo PAPER + barra navy sinistra + titolo navy + footer navy con brand gold.
    Stile derivato da .band-paper + .band-alt + blockquote border di globals.css.
    Uso tipico: "I 3 errori che ti fanno perdere il rimborso" (post_006)

    content:
      title    — titolo principale in navy
      subtitle — riga muted sotto il titolo (opzionale)
    """
    img, draw = _canvas(aspect_ratio, PAPER)
    w, h = img.size

    pad = int(w * 0.10)
    max_w = w - pad * 2
    footer_h = int(h * 0.13)
    sidebar_w = int(w * 0.018)

    # Barra laterale sinistra navy (sidebar accent del brand)
    draw.rectangle([0, 0, sidebar_w, h], fill=NAVY_DEEP)

    # Rombo gold a metà altezza sulla barra
    _diamond(draw, sidebar_w // 2, int(h * 0.20), int(w * 0.013))
    _diamond(draw, sidebar_w // 2, int(h * 0.50), int(w * 0.009))

    y = int(h * 0.08)

    # Titolo
    f_title = _font("black", int(h * 0.088))
    for line in _wrap_multiline(content["title"], f_title, max_w):
        bx = draw.textbbox((0, 0), line, font=f_title)
        draw.text((pad, y), line, fill=NAVY_DEEP, font=f_title)
        y += int((bx[3] - bx[1]) * 1.08)

    # Barra gold orizzontale (da blockquote border-left: 3px solid #FFC300)
    y += int(h * 0.022)
    gold_h = max(4, int(h * 0.005))
    draw.rectangle([pad, y, pad + int(w * 0.14), y + gold_h], fill=GOLD)
    y += gold_h + int(h * 0.028)

    # Sottotitolo opzionale
    subtitle = content.get("subtitle", "")
    if subtitle:
        f_sub = _font("medium", int(h * 0.042))
        for line in _wrap(subtitle, f_sub, max_w):
            draw.text((pad, y), line, fill=NAVY_DIM, font=f_sub)
            bx = draw.textbbox((0, 0), line, font=f_sub)
            y += int((bx[3] - bx[1]) * 1.3)

    # Footer navy con brand gold
    draw.rectangle([0, h - footer_h, w, h], fill=NAVY_DEEP)
    f_foot = _font("semibold", int(h * 0.030))
    text = "giustiziainvolo.it"
    tw = _text_w(text, f_foot)
    bx = draw.textbbox((0, 0), text, font=f_foot)
    th = bx[3] - bx[1]
    ty = h - footer_h + (footer_h - th) // 2
    draw.text((int((w - tw) // 2), ty), text, fill=GOLD, font=f_foot)

    img.save(output_path, "JPEG", quality=95)


# ── Template: question ─────────────────────────────────────────────────────────
def _template_question(content: dict, output_path: str, aspect_ratio: str):
    """
    Sfondo NAVY_MED + pattern bianco leggero, domanda centrata, statistica in gold, footer.
    Stile derivato da .band-alt / .cover-stripes di globals.css.
    Uso tipico: "Hai mai subito un disservizio aereo?" (post_008)

    content:
      title    — la domanda, centrata
      subtitle — statistica o invito a interagire (opzionale)
    """
    img, draw = _canvas(aspect_ratio, NAVY_MED)
    w, h = img.size
    img = _apply_stripes(img, WHITE, 12, 18)
    draw = ImageDraw.Draw(img)

    pad = int(w * 0.09)
    max_w = w - pad * 2
    footer_h = int(h * 0.11)
    r = int(w * 0.020)
    y = int(h * 0.09)

    # Rombi decorativi ai due angoli alti
    _diamond(draw, pad + r, y + r, r)
    _diamond(draw, w - pad - r, y + r, r)
    y += int(h * 0.08)

    # Domanda principale
    f_title = _font("black", int(h * 0.082))
    for line in _wrap(content["title"], f_title, max_w):
        lw = _text_w(line, f_title)
        bx = draw.textbbox((0, 0), line, font=f_title)
        draw.text(((w - lw) // 2, y), line, fill=WHITE, font=f_title)
        y += int((bx[3] - bx[1]) * 1.12)

    # Separatore gold centrato
    y += int(h * 0.045)
    sep_w = int(w * 0.15)
    draw.rectangle([(w - sep_w) // 2, y, (w + sep_w) // 2, y + max(3, int(h * 0.004))],
                   fill=GOLD)
    y += int(h * 0.05)

    # Sottotitolo / statistica
    subtitle = content.get("subtitle", "")
    if subtitle:
        f_sub = _font("medium", int(h * 0.038))
        for line in _wrap(subtitle, f_sub, max_w):
            lw = _text_w(line, f_sub)
            bx = draw.textbbox((0, 0), line, font=f_sub)
            draw.text(((w - lw) // 2, y), line, fill=GOLD_DIM, font=f_sub)
            y += int((bx[3] - bx[1]) * 1.3)

    _footer_dark(draw, w, h, footer_h)
    img.save(output_path, "JPEG", quality=95)


# ── Template: carousel_intro ───────────────────────────────────────────────────
def _template_carousel_intro(content: dict, output_path: str, aspect_ratio: str):
    """
    Cover del carosello. NAVY_DEEP + diagonali gold, barra gold top, titolo bianco, footer.
    content: { title, subtitle (opz.) }
    """
    img, draw = _canvas(aspect_ratio, NAVY_DEEP)
    w, h = img.size
    img = _apply_stripes(img, GOLD, 25, 20)
    draw = ImageDraw.Draw(img)

    pad = int(w * 0.08)
    max_w = w - pad * 2
    footer_h = int(h * 0.12)

    # Barra gold orizzontale in cima (accent cover)
    bar_h = max(5, int(h * 0.007))
    draw.rectangle([0, 0, w, bar_h], fill=GOLD)

    # Rombo decorativo centrato
    y = int(h * 0.11)
    _diamond(draw, w // 2, y, int(w * 0.018))
    y += int(h * 0.07)

    # Titolo
    f_title = _font("ultrablack", int(h * 0.090))
    for line in _wrap(content["title"], f_title, max_w):
        bx = draw.textbbox((0, 0), line, font=f_title)
        lw = bx[2] - bx[0]
        draw.text(((w - lw) // 2, y), line, fill=WHITE, font=f_title)
        y += int((bx[3] - bx[1]) * 1.05)

    # Sottotitolo
    subtitle = content.get("subtitle", "")
    if subtitle:
        y += int(h * 0.025)
        f_sub = _font("medium", int(h * 0.040))
        for line in _wrap(subtitle, f_sub, max_w):
            lw = _text_w(line, f_sub)
            bx = draw.textbbox((0, 0), line, font=f_sub)
            draw.text(((w - lw) // 2, y), line, fill=GOLD_DIM, font=f_sub)
            y += int((bx[3] - bx[1]) * 1.3)

    _footer_dark(draw, w, h, footer_h)
    img.save(output_path, "JPEG", quality=95)


# ── Template: carousel_error ───────────────────────────────────────────────────
def _template_carousel_error(content: dict, output_path: str, aspect_ratio: str):
    """
    Slide errore numerato per carosello. PAPER bg, badge gold numero, titolo + body navy.
    Barra navy sinistra coerente con list_cover.
    content: { number ("01"/"02"/"03"), title, body }
    """
    img, draw = _canvas(aspect_ratio, PAPER)
    w, h = img.size

    pad = int(w * 0.10)
    max_w = w - pad * 2
    sidebar_w = int(w * 0.018)

    # Barra navy sinistra (brand sidebar)
    draw.rectangle([0, 0, sidebar_w, h], fill=NAVY_DEEP)

    # Badge numero: cerchio gold in alto a sinistra
    badge_r = int(w * 0.075)
    badge_cx = pad + badge_r
    badge_cy = int(h * 0.12) + badge_r
    draw.ellipse(
        [badge_cx - badge_r, badge_cy - badge_r,
         badge_cx + badge_r, badge_cy + badge_r],
        fill=GOLD,
    )
    f_num = _font("ultrablack", int(badge_r * 1.1))
    num_text = content.get("number", "?")
    nw = _text_w(num_text, f_num)
    bx_n = draw.textbbox((0, 0), num_text, font=f_num)
    nh = bx_n[3] - bx_n[1]
    draw.text((badge_cx - int(nw // 2), badge_cy - nh // 2), num_text,
              fill=NAVY_DEEP, font=f_num)

    y = badge_cy + badge_r + int(h * 0.05)

    # Titolo
    f_title = _font("black", int(h * 0.072))
    for line in _wrap(content["title"], f_title, max_w):
        bx = draw.textbbox((0, 0), line, font=f_title)
        draw.text((pad, y), line, fill=NAVY_DEEP, font=f_title)
        y += int((bx[3] - bx[1]) * 1.08)

    # Barra gold breve sotto il titolo
    y += int(h * 0.020)
    draw.rectangle([pad, y, pad + int(w * 0.08), y + max(3, int(h * 0.004))], fill=GOLD)
    y += int(h * 0.038)

    # Body text
    body = content.get("body", "")
    if body:
        f_body = _font("regular", int(h * 0.038))
        for line in _wrap(body, f_body, max_w):
            bx = draw.textbbox((0, 0), line, font=f_body)
            draw.text((pad, y), line, fill=NAVY_DIM, font=f_body)
            y += int((bx[3] - bx[1]) * 1.55)

    img.save(output_path, "JPEG", quality=95)


# ── Template: carousel_cta ─────────────────────────────────────────────────────
def _template_carousel_cta(content: dict, output_path: str, aspect_ratio: str):
    """
    Slide CTA finale del carosello. NAVY_DEEP senza pattern, contenuto centrato.
    content: { title, cta, url (opz.) }
    """
    img, draw = _canvas(aspect_ratio, NAVY_DEEP)
    w, h = img.size

    pad = int(w * 0.08)
    max_w = w - pad * 2

    # Rombi decorativi verticali (top e bottom)
    _diamond(draw, w // 2, int(h * 0.11), int(w * 0.018))
    _diamond(draw, w // 2, int(h * 0.89), int(w * 0.013))

    # Titolo grande centrato
    y = int(h * 0.21)
    f_title = _font("ultrablack", int(h * 0.095))
    for line in _wrap_multiline(content["title"], f_title, max_w):
        if not line:
            y += int(h * 0.03)
            continue
        bx = draw.textbbox((0, 0), line, font=f_title)
        lw = bx[2] - bx[0]
        draw.text(((w - lw) // 2, y), line, fill=WHITE, font=f_title)
        y += int((bx[3] - bx[1]) * 1.05)

    # Separatore gold
    y += int(h * 0.04)
    sep_w = int(w * 0.12)
    draw.rectangle([(w - sep_w) // 2, y, (w + sep_w) // 2, y + max(3, int(h * 0.004))],
                   fill=GOLD)
    y += int(h * 0.05)

    # CTA in pill navy-medium con testo gold
    cta = content.get("cta", "")
    if cta:
        f_cta = _font("bold", int(h * 0.042))
        cta_w = _text_w(cta, f_cta)
        bx = draw.textbbox((0, 0), cta, font=f_cta)
        cta_h = bx[3] - bx[1]
        px, py = int(h * 0.025), int(h * 0.015)
        cx = int((w - cta_w) // 2)
        draw.rounded_rectangle(
            [cx - px, y - py, cx + int(cta_w) + px, y + cta_h + py],
            radius=int(h * 0.02),
            fill=NAVY_MED,
        )
        draw.text((cx, y), cta, fill=GOLD, font=f_cta)
        y += cta_h + py * 2 + int(h * 0.04)

    # URL in basso centrato
    url = content.get("url", "giustiziainvolo.it")
    f_url = _font("semibold", int(h * 0.028))
    url_w = _text_w(url, f_url)
    bx_u = draw.textbbox((0, 0), url, font=f_url)
    uh = bx_u[3] - bx_u[1]
    draw.text((int((w - url_w) // 2), h - int(h * 0.08)), url, fill=GOLD, font=f_url)

    img.save(output_path, "JPEG", quality=95)


# ── Public API ─────────────────────────────────────────────────────────────────
TEMPLATES = {
    "headline":        _template_headline,
    "list_cover":      _template_list_cover,
    "question":        _template_question,
    "carousel_intro":  _template_carousel_intro,
    "carousel_error":  _template_carousel_error,
    "carousel_cta":    _template_carousel_cta,
}

def generate_graphic(template_name: str, content: dict,
                     output_path: str, aspect_ratio: str = "1:1"):
    fn = TEMPLATES.get(template_name)
    if fn is None:
        raise ValueError(
            f"Template sconosciuto: '{template_name}'. Disponibili: {list(TEMPLATES)}"
        )
    fn(content, output_path, aspect_ratio)


if __name__ == "__main__":
    out = Path(__file__).parent / "images"
    out.mkdir(exist_ok=True)
    tests = [
        ("headline",       {"accent": "Lo sapevi?", "title": "Hai 2 anni\\ndi tempo.",
                            "subtitle": "per reclamare il rimborso del tuo volo"},
                           "_test_headline.jpg"),
        ("list_cover",     {"title": "I 3 errori che ti fanno perdere il rimborso del volo",
                            "subtitle": "(e come evitarli)"},
                           "_test_list_cover.jpg"),
        ("question",       {"title": "Hai mai subito un disservizio aereo?",
                            "subtitle": "Il 70% dei passeggeri non sa di avere diritto fino a €600"},
                           "_test_question.jpg"),
        ("carousel_intro", {"title": "I 3 errori che ti fanno perdere il rimborso del volo",
                            "subtitle": "(e come evitarli)"},
                           "_test_carousel_intro.jpg"),
        ("carousel_error", {"number": "01", "title": "Accettare il voucher senza leggere",
                            "body": "La compagnia ti offre un buono viaggio? In alcuni casi "
                                    "accettarlo significa rinunciare al rimborso in denaro fino a "
                                    "€600. Leggi sempre le condizioni prima di firmare."},
                           "_test_carousel_error.jpg"),
        ("carousel_cta",   {"title": "Non perdere quello che ti spetta.",
                            "cta": "Verifica subito il tuo caso",
                            "url": "giustiziainvolo.it"},
                           "_test_carousel_cta.jpg"),
    ]
    for tmpl, c, fname in tests:
        generate_graphic(tmpl, c, str(out / fname))
        print(f"✓ {tmpl} → social/images/{fname}")
    print(f"\nRivedi le immagini in social/images/ (prefisso _test_) prima di usarle in prod.")
