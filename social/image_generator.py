#!/usr/bin/env python3
import json
import os
import sys
from pathlib import Path

from google import genai
from google.genai import types

POSTS_FILE = Path(__file__).parent / "posts.json"
IMAGES_DIR = Path(__file__).parent / "images"


def load_posts():
    with open(POSTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def generate_image(client, post):
    result = client.models.generate_images(
        model="imagen-3.0-generate-002",
        prompt=post["image_prompt"],
        config=types.GenerateImagesConfig(
            number_of_images=1,
            aspect_ratio=post.get("image_aspect_ratio", "1:1"),
        ),
    )
    return result.generated_images[0].image.image_bytes


def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY environment variable not set")
        sys.exit(1)

    client = genai.Client(api_key=api_key)
    data = load_posts()

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

        print(f"[GEN]   {post_id} — aspect {post.get('image_aspect_ratio', '1:1')}...")
        try:
            image_bytes = generate_image(client, post)
            with open(output_path, "wb") as f:
                f.write(image_bytes)
            print(f"        ✓ Salvato → {output_path}")
            generated += 1
        except Exception as e:
            print(f"        ✗ Errore: {e}")
            failed += 1

    print(f"\nCompletato: {generated} generate, {skipped} skippate, {failed} fallite.")
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
