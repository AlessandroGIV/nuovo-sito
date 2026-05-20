#!/usr/bin/env python3
import json
import os
import sys
import requests
from datetime import date, datetime

POSTS_FILE = os.path.join(os.path.dirname(__file__), "posts.json")
WEBHOOK_URL = os.environ.get("MAKE_WEBHOOK_URL")


def load_posts():
    with open(POSTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_posts(data):
    with open(POSTS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def get_caption_groups(post):
    """Returns list of (caption, platforms) tuples to send for this post.

    Posts with a single 'caption' string send one payload to all platforms.
    Posts with a 'captions' dict split into per-platform-group payloads so
    that facebook/instagram and linkedin can carry different copy.
    """
    if "caption" in post:
        return [(post["caption"], post["platforms"])]

    groups = []
    captions = post["captions"]
    fi_platforms = [p for p in post["platforms"] if p in ("facebook", "instagram")]
    li_platforms = [p for p in post["platforms"] if p == "linkedin"]

    if fi_platforms and "facebook_instagram" in captions:
        groups.append((captions["facebook_instagram"], fi_platforms))
    if li_platforms and "linkedin" in captions:
        groups.append((captions["linkedin"], li_platforms))

    return groups


def publish_post(post, caption, platforms):
    payload = {
        "id": post["id"],
        "caption": caption,
        "image_url": post["image_url"],
        "platforms": platforms,
        "scheduled_time": post["scheduled_time"],
    }
    response = requests.post(WEBHOOK_URL, json=payload, timeout=30)
    response.raise_for_status()
    return response


def main():
    if not WEBHOOK_URL:
        print("ERROR: MAKE_WEBHOOK_URL environment variable not set")
        sys.exit(1)

    today = date.today().isoformat()
    print(f"[{datetime.now().isoformat()}] Publisher avviato — data: {today}")

    data = load_posts()
    posts_today = [
        p for p in data["posts"]
        if p["scheduled_date"] == today and not p["published"]
    ]

    if not posts_today:
        print("Nessun post schedulato per oggi.")
        return

    print(f"Trovati {len(posts_today)} post da pubblicare.")
    modified = False

    for post in posts_today:
        print(f"\n→ Invio {post['id']} ({', '.join(post['platforms'])})...")
        groups = get_caption_groups(post)
        all_ok = True
        for caption, platforms in groups:
            try:
                resp = publish_post(post, caption, platforms)
                print(f"  ✓ Inviato ({', '.join(platforms)}) — HTTP {resp.status_code}")
            except requests.HTTPError as e:
                print(f"  ✗ Errore HTTP ({', '.join(platforms)}): {e.response.status_code} — {e.response.text}")
                all_ok = False
            except requests.RequestException as e:
                print(f"  ✗ Errore di rete ({', '.join(platforms)}): {e}")
                all_ok = False
        if all_ok:
            post["published"] = True
            modified = True

    if modified:
        save_posts(data)
        print("\nposts.json aggiornato (published: true).")

    failed = [p for p in posts_today if not p["published"]]
    if failed:
        print(f"\n{len(failed)} post non inviati — workflow fallito.")
        sys.exit(1)

    print(f"\nCompletato: {len(posts_today) - len(failed)}/{len(posts_today)} post inviati.")


if __name__ == "__main__":
    main()
