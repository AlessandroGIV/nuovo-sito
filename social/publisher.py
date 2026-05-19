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


def publish_post(post):
    payload = {
        "id": post["id"],
        "caption": post["caption"],
        "image_url": post["image_url"],
        "platforms": post["platforms"],
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
        try:
            resp = publish_post(post)
            post["published"] = True
            modified = True
            print(f"  ✓ Inviato — HTTP {resp.status_code}")
        except requests.HTTPError as e:
            print(f"  ✗ Errore HTTP: {e.response.status_code} — {e.response.text}")
        except requests.RequestException as e:
            print(f"  ✗ Errore di rete: {e}")

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
