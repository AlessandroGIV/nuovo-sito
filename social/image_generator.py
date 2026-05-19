#!/usr/bin/env python3
import json
import os
import sys
from pathlib import Path

from google import genai
from google.genai import types
from PIL import Image, ImageDraw, ImageFont
import sys as _sys
_sys.path.insert(0, str(Path(__file__).parent))
from graphic_generator import generate_graphic

POSTS_FILE = Path(__file__).parent / "posts.json"
IMAGES_DIR = Path(__file__).parent / "images"


def load_posts():
    with open(POSTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def generate_image(client, post):
    result = client.models.generate_images(
        model="imagen-4.0-generate-001",
        prompt=post["image_prompt"],
        config=types.GenerateImagesConfig(
            number_of_images=1,
            aspect_ratio=post.get("image_aspect_ratio", "1:1"),
        ),
    )
    return result.generated_images[0].image.image_bytes


def add_watermark(image_path):
    img = Image.open(image_path).convert("RGB")
    draw = ImageDraw.Draw(img, "RGBA")
    width, height = img.size

    text = "giustiziainvolo.it"
    font_size = int(height * 0.025)

    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except OSError:
        try:
            font = ImageFont.truetype("Arial.ttf", font_size)
        except OSError:
            font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    padding = int(height * 0.03)
    x = width - text_w - padding
    y = height - text_h - padding

    bg_pad = int(font_size * 0.4)
    draw.rectangle(
        [x - bg_pad, y - bg_pad, x + text_w + bg_pad, y + text_h + bg_pad],
        fill=(0, 0, 0, 140),
    )
    draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)
    img.save(image_path, "JPEG", quality=95)


def main():
    data = load_posts()
    client = None  # inizializzato lazily solo se servono post con image_prompt

    total = len(data["posts"])
    generated = 0
    skipped = 0
    failed = 0

    print(f"Image generator avviato — {total} post nel calendario\n")

    for post in data["posts"]:
        post_id = post["id"]
        output_path = IMAGES_DIR / f"{post_id}.jpg"

        if output_path.exists():
            print(f"[SKIP]  {post_id} — già presente ({output_path.name})")
            skipped += 1
            continue

        try:
            if "graphic_template" in post:
                print(f"[GRAPHIC] {post_id} — template '{post['graphic_template']}'...")
                generate_graphic(
                    post["graphic_template"],
                    post["graphic_content"],
                    str(output_path),
                    post.get("image_aspect_ratio", "1:1"),
                )
                print(f"          ✓ Generato → {output_path.name}")
            elif "image_prompt" in post:
                print(f"[IMAGEN]  {post_id} — aspect {post.get('image_aspect_ratio', '1:1')}...")
                if client is None:
                    api_key = os.environ.get("GEMINI_API_KEY")
                    if not api_key:
                        print("ERROR: GEMINI_API_KEY non impostata — necessaria per i post fotografici")
                        sys.exit(1)
                    client = genai.Client(api_key=api_key)
                image_bytes = generate_image(client, post)
                with open(output_path, "wb") as f:
                    f.write(image_bytes)
                if post.get("add_watermark", False):
                    add_watermark(output_path)
                    print(f"          ✓ Salvato con watermark → {output_path.name}")
                else:
                    print(f"          ✓ Salvato → {output_path.name}")
            else:
                print(f"[WARN]    {post_id} — nessun image_prompt né graphic_template, skip.")
                skipped += 1
                continue
            generated += 1
        except Exception as e:
            print(f"          ✗ Errore: {e}")
            failed += 1

    print(f"\nCompletato: {generated} generate, {skipped} skippate, {failed} fallite.")
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
