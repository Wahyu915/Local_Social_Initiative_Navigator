#!/usr/bin/env python3
import csv, os, time, json
from urllib.parse import urlencode
import requests

API = os.getenv("API_BASE", "http://127.0.0.1:5000")  # override with API_BASE if needed
DRY_RUN = os.getenv("DRY_RUN", "0") == "1"            # set DRY_RUN=1 to preview only
SLEEP = float(os.getenv("SLEEP", "0.05"))             # throttle between requests

def search_by_name(name: str):
    """Best-effort check to avoid duplicates: searches by name and returns first match (if any)."""
    url = f"{API}/api/ngos?{urlencode({'q': name, 'limit': 1})}"
    r = requests.get(url, timeout=15)
    r.raise_for_status()
    data = r.json()
    return (data.get("ngos") or [None])[0]

def to_bool(x):
    return str(x).strip().lower() in ("1","true","yes","y")

def import_row(row: dict):
    payload = {
        "name": (row.get("name") or "").strip(),
        "short_desc": (row.get("short_desc") or "").strip() or None,
        "full_desc": (row.get("full_desc") or "").strip() or None,
        "website": (row.get("website") or "").strip() or None,
        "email": (row.get("email") or "").strip() or None,
        "phone": (row.get("phone") or "").strip() or None,
        "city": (row.get("city") or "").strip() or None,
        "district": (row.get("district") or "").strip() or None,
        "verified": to_bool(row.get("verified", "")),
        "tags": [t.strip() for t in (row.get("tags","").split(",")) if t.strip()],
    }

    if not payload["name"]:
        return ("skip", "missing name")

    # duplicate guard (by name similarity)
    existing = search_by_name(payload["name"])
    if existing and existing.get("name","").lower() == payload["name"].lower():
        return ("exists", f"NGO already present with id={existing.get('id')}")

    if DRY_RUN:
        return ("dry", json.dumps(payload, ensure_ascii=False))

    r = requests.post(f"{API}/api/ngos", json=payload, timeout=20)
    try:
        r.raise_for_status()
    except Exception as e:
        return ("error", f"{r.status_code} {r.text}")
    return ("ok", r.json())

def main():
    ok=exists=skips=errors=dry=0
    with open("ngos.csv", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=1):
            status, info = import_row(row)
            if status == "ok":
                ok += 1
                print(f"[{i}] ✅ Created:", info)
            elif status == "exists":
                exists += 1
                print(f"[{i}] ↺ Exists:", info)
            elif status == "skip":
                skips += 1
                print(f"[{i}] ⏭️  Skipped:", info)
            elif status == "dry":
                dry += 1
                print(f"[{i}] 🧪 DRY-RUN:", info)
            else:
                errors += 1
                print(f"[{i}] ❌ Error:", info)
            time.sleep(SLEEP)
    print("\nSummary:",
          f"ok={ok}, exists={exists}, skipped={skips}, errors={errors}, dry={dry}")

if __name__ == "__main__":
    main()
