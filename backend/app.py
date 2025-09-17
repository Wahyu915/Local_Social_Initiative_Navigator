import os
from flask import Flask, request, jsonify, url_for
from flask_cors import CORS
from sqlalchemy import text
from db import Base, engine
from models import NGO, Tag, NGOTag, Opportunity, Event, WishlistItem, WishlistOffer
from nlu import parse_query

app = Flask(__name__)
CORS(app)

ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "dev-admin-token")

def require_admin():
    token = request.headers.get("X-Admin-Token")
    if token != ADMIN_TOKEN:
        return jsonify({"error": "unauthorized"}), 401

# Create tables on first run (hackathon speed)
with engine.begin() as conn:
    Base.metadata.create_all(conn)

# ---------- Utility: logo lookup (by NGO id) ----------
def find_logo_url(ngo_id: int):
    """Return a static logo URL if a matching file exists in static/logos by id."""
    static_dir = os.path.join(os.path.dirname(__file__), "static", "logos")
    exts = ("png", "jpg", "jpeg", "webp")
    for ext in exts:
        fname = f"{ngo_id}.{ext}"
        fpath = os.path.join(static_dir, fname)
        if os.path.exists(fpath):
            return url_for("static", filename=f"logos/{fname}", _external=True)
    return None

# ---------- Landing & health ----------

@app.get("/")
def home():
    return {
        "service": "impact-navigator",
        "status": "ok",
        "docs": {
            "health": "/api/healthz",
            "search": "POST /api/search",
            "events": "POST /api/events",
            "create_ngo": "POST /api/ngos",
            "list_ngos": "GET /api/ngos",
            "wishlist_list": "GET /api/wishlist",
            "wishlist_detail": "GET /api/wishlist/{id}",
            "wishlist_create": "POST /api/wishlist",
            "wishlist_offer_create": "POST /api/wishlist/{id}/offers"
        }
    }

@app.get("/api/healthz")
def healthz():
    return {"ok": True}

# ---------- Metrics / events ----------

@app.post("/api/events")
def create_event():
    data = request.get_json(force=True)
    event_type = data.get("event_type")
    payload = data.get("payload", {})
    if not event_type:
        return jsonify({"error": "event_type required"}), 400

    from db import SessionLocal
    db = SessionLocal()
    try:
        ev = Event(event_type=event_type, payload=payload)
        db.add(ev)
        db.commit()
        return jsonify({"ok": True})
    finally:
        db.close()

# ---------- Search ----------

@app.post("/api/search")
def search():
    body = request.get_json(force=True) if request.data else {}
    q = body.get("q", "")
    limit = min(int(body.get("limit", 20)), 50)
    offset = int(body.get("offset", 0))

    parsed = parse_query(q)
    terms = (" ".join(parsed["terms"]) or q).strip()
    city = parsed["city"]
    district = parsed["district"]

    from db import SessionLocal
    db = SessionLocal()
    try:
        ngo_sql = """
        SELECT n.id, n.name, n.short_desc, n.website, n.city, n.district, n.verified,
               GREATEST(similarity(n.name, :terms), similarity(coalesce(n.short_desc,''), :terms))
               + CASE WHEN :city IS NOT NULL AND lower(n.city) = lower(:city) THEN 0.15 ELSE 0 END
               + CASE WHEN :district IS NOT NULL AND lower(n.district) = lower(:district) THEN 0.15 ELSE 0 END
               AS score
        FROM ngos n
        WHERE (:terms = '' OR n.name % :terms OR coalesce(n.short_desc,'') % :terms)
        ORDER BY score DESC NULLS LAST
        LIMIT :limit OFFSET :offset
        """
        ngo_rows = db.execute(
            text(ngo_sql),
            {"terms": terms, "city": city, "district": district, "limit": limit, "offset": offset}
        ).mappings().all()

        # Attach tags
        ngo_ids = [r["id"] for r in ngo_rows]
        tag_map = {}
        if ngo_ids:
            tag_map_sql = """
            SELECT nt.ngo_id, t.key
            FROM ngo_tags nt
            JOIN tags t ON t.id = nt.tag_id
            WHERE nt.ngo_id = ANY(:ids)
            """
            for row in db.execute(text(tag_map_sql), {"ids": ngo_ids}).mappings().all():
                tag_map.setdefault(row["ngo_id"], []).append(row["key"])

        resp = {
            "results": {
                "ngos": [
                    {
                        "id": r["id"],
                        "name": r["name"],
                        "short_desc": r["short_desc"],
                        "website": r["website"],
                        "city": r["city"],
                        "district": r["district"],
                        "verified": r["verified"],
                        "score": round(float(r["score"] or 0), 4),
                        "tags": tag_map.get(r["id"], [])
                    } for r in ngo_rows
                ]
            },
            "meta": {"limit": limit, "offset": offset, "total_estimate": len(ngo_rows)}
        }

        db.add(Event(event_type="search", payload={"q": q, "city": city, "district": district}))
        db.commit()

        return jsonify(resp)
    finally:
        db.close()

# ---------- NGO detail (public) ----------
@app.get("/api/ngos/<int:ngo_id>")
def get_ngo(ngo_id):
    from db import SessionLocal
    db = SessionLocal()
    try:
        row = db.execute(text("""
            SELECT n.id, n.name, n.short_desc, n.full_desc, n.website, n.phone, n.email,
                   n.city, n.district, n.latitude, n.longitude, n.verified,
                   n.created_at, n.updated_at, n.logo_url
            FROM ngos n
            WHERE n.id = :id
        """), {"id": ngo_id}).mappings().first()
        if not row:
            return jsonify({"error": "not found"}), 404

        tag_rows = db.execute(text("""
            SELECT t.key, t.name
            FROM ngo_tags nt
            JOIN tags t ON t.id = nt.tag_id
            WHERE nt.ngo_id = :id
        """), {"id": ngo_id}).mappings().all()

        data = dict(row)
        # attach logo_url if a static file exists for this NGO id
        data["logo_url"] = find_logo_url(data["id"])

        return jsonify({"ngo": data, "tags": [dict(t) for t in tag_rows]})
    finally:
        db.close()

# ---------- NGOs ----------

@app.get("/api/ngos")
def list_ngos():
    q = request.args.get("q", "")
    city = request.args.get("city")
    district = request.args.get("district")
    verified = request.args.get("verified")  # "true" | "false"
    limit = min(int(request.args.get("limit", 20)), 50)
    offset = int(request.args.get("offset", 0))
    terms = q.strip()

    from db import SessionLocal
    db = SessionLocal()
    try:
        base_sql = """
        SELECT n.id, n.name, n.short_desc, n.website, n.city, n.district, n.verified, n.logo_url,
               GREATEST(similarity(n.name, :terms), similarity(coalesce(n.short_desc,''), :terms)) AS score
        FROM ngos n
        WHERE (:terms = '' OR n.name % :terms OR coalesce(n.short_desc,'') % :terms)
        """
        filters = []
        if city:     filters.append("lower(n.city) = lower(:city)")
        if district: filters.append("lower(n.district) = lower(:district)")
        if verified in ("true", "false"):
            filters.append("n.verified = :verified")
        if filters:
            base_sql += " AND " + " AND ".join(filters)
        base_sql += " ORDER BY score DESC NULLS LAST LIMIT :limit OFFSET :offset"

        rows = db.execute(
            text(base_sql),
            {
                "terms": terms,
                "city": city,
                "district": district,
                "verified": (verified == "true") if verified in ("true","false") else None,
                "limit": limit,
                "offset": offset,
            },
        ).mappings().all()
        return jsonify({"ngos": [dict(r) for r in rows], "meta": {"limit": limit, "offset": offset}})
    finally:
        db.close()

@app.post("/api/ngos")
def create_ngo():
    data = request.get_json(force=True)
    if not data.get("name"):
        return jsonify({"error": "name required"}), 400

    from db import SessionLocal
    db = SessionLocal()
    try:
        ngo = NGO(
            name=data["name"].strip(),
            short_desc=data.get("short_desc"),
            full_desc=data.get("full_desc"),
            website=data.get("website"),
            phone=data.get("phone"),
            email=data.get("email"),
            city=data.get("city"),
            district=data.get("district"),
            verified=bool(data.get("verified", False)),
            logo_url=data.get("logo_url")
        )
        db.add(ngo); db.flush()

        for key in data.get("tags", []):
            tag = db.query(Tag).filter_by(key=key).first()
            if not tag:
                tag = Tag(key=key, name=key.replace("-", " ").title())
                db.add(tag); db.flush()
            db.add(NGOTag(ngo_id=ngo.id, tag_id=tag.id))

        db.commit()
        return jsonify({"id": ngo.id, "ok": True}), 201
    finally:
        db.close()

# ---------- Wishlist (public browse + donor offers) ----------

@app.get("/api/wishlist")
def list_wishlist():
    status = request.args.get("status", "open")
    ngo_id = request.args.get("ngo_id")
    q = request.args.get("q", "").strip()
    limit = min(int(request.args.get("limit", 20)), 50)
    offset = int(request.args.get("offset", 0))

    from db import SessionLocal
    db = SessionLocal()
    try:
        base = """
        SELECT w.id, w.ngo_id, n.name as ngo_name, w.title, w.description,
               w.quantity, w.unit, w.priority, w.needed_by, w.status,
               w.created_at, w.updated_at
        FROM wishlist_items w
        JOIN ngos n ON n.id = w.ngo_id
        WHERE (:status = '' OR lower(w.status) = lower(:status))
        """
        filters = []
        if ngo_id:
            filters.append("w.ngo_id = :ngo_id")
        if q:
            filters.append("(w.title ILIKE :likeq OR coalesce(w.description,'') ILIKE :likeq)")
        if filters:
            base += " AND " + " AND ".join(filters)
        base += " ORDER BY w.priority DESC, w.created_at DESC LIMIT :limit OFFSET :offset"

        rows = db.execute(
            text(base),
            {"status": status or "", "ngo_id": int(ngo_id) if ngo_id else None,
             "likeq": f"%{q}%" if q else None, "limit": limit, "offset": offset}
        ).mappings().all()

        return jsonify({"items": [dict(r) for r in rows], "meta": {"limit": limit, "offset": offset}})
    finally:
        db.close()

@app.get("/api/wishlist/<int:item_id>")
def get_wishlist_item(item_id):
    from db import SessionLocal
    db = SessionLocal()
    try:
        row = db.execute(text("""
        SELECT w.id, w.ngo_id, n.name as ngo_name, w.title, w.description,
               w.quantity, w.unit, w.priority, w.needed_by, w.status,
               w.created_at, w.updated_at
        FROM wishlist_items w
        JOIN ngos n ON n.id = w.ngo_id
        WHERE w.id = :id
        """), {"id": item_id}).mappings().first()
        if not row:
            return jsonify({"error": "not found"}), 404

        offers = db.execute(text("""
        SELECT id, donor_name, donor_email, quantity, message, status, created_at
        FROM wishlist_offers
        WHERE wishlist_id = :id
        ORDER BY created_at DESC
        """), {"id": item_id}).mappings().all()

        return jsonify({"item": dict(row), "offers": [dict(o) for o in offers]})
    finally:
        db.close()

@app.post("/api/wishlist/<int:item_id>/offers")
def create_offer(item_id):
    data = request.get_json(force=True)
    donor_name = (data.get("donor_name") or "").strip()
    if not donor_name:
        return jsonify({"error": "donor_name required"}), 400

    from db import SessionLocal
    db = SessionLocal()
    try:
        item = db.get(WishlistItem, item_id)
        if not item:
            return jsonify({"error": "wishlist item not found"}), 404
        if item.status not in ("open", "reserved"):
            return jsonify({"error": f"item is {item.status}"}), 400

        offer = WishlistOffer(
            wishlist_id=item_id,
            donor_name=donor_name,
            donor_email=(data.get("donor_email") or "").strip() or None,
            quantity=int(data.get("quantity", 1)),
            message=(data.get("message") or "").strip() or None,
            status="pending"
        )
        db.add(offer); db.commit()

        db.add(Event(event_type="wishlist_offer", payload={"wishlist_id": item_id, "donor_name": donor_name}))
        db.commit()

        return jsonify({"ok": True, "offer_id": offer.id}), 201
    finally:
        db.close()

# ---------- Wishlist (NGO/admin, protected) ----------

@app.post("/api/wishlist")
def create_wishlist_item():
    auth = require_admin()
    if auth: return auth

    data = request.get_json(force=True)
    required = ["ngo_id", "title"]
    miss = [k for k in required if not data.get(k)]
    if miss:
        return jsonify({"error": f"missing fields: {', '.join(miss)}"}), 400

    from db import SessionLocal
    db = SessionLocal()
    try:
        ngo = db.get(NGO, int(data["ngo_id"]))
        if not ngo:
            return jsonify({"error": "ngo not found"}), 404

        item = WishlistItem(
            ngo_id=ngo.id,
            title=data["title"].strip(),
            description=(data.get("description") or "").strip() or None,
            quantity=int(data.get("quantity", 1)),
            unit=(data.get("unit") or "").strip() or None,
            priority=(data.get("priority") or "normal"),
            needed_by=data.get("needed_by"),
            status="open"
        )
        db.add(item); db.commit()
        return jsonify({"ok": True, "id": item.id}), 201
    finally:
        db.close()

@app.patch("/api/wishlist/<int:item_id>")
def update_wishlist_item(item_id):
    auth = require_admin()
    if auth: return auth

    data = request.get_json(force=True)
    from db import SessionLocal
    db = SessionLocal()
    try:
        item = db.get(WishlistItem, item_id)
        if not item:
            return jsonify({"error": "not found"}), 404

        for field in ["title","description","unit","priority","status"]:
            if field in data and data[field] is not None:
                val = data[field]
                item.__setattr__(field, val.strip() if isinstance(val, str) else val)
        if "quantity" in data and data["quantity"] is not None:
            item.quantity = int(data["quantity"])
        if "needed_by" in data:
            item.needed_by = data["needed_by"]

        db.commit()
        return jsonify({"ok": True})
    finally:
        db.close()

@app.patch("/api/wishlist/offers/<int:offer_id>")
def update_offer(offer_id):
    auth = require_admin()
    if auth: return auth

    data = request.get_json(force=True)
    from db import SessionLocal
    db = SessionLocal()
    try:
        offer = db.get(WishlistOffer, offer_id)
        if not offer:
            return jsonify({"error": "offer not found"}), 404

        if "status" in data and data["status"] in ("pending","accepted","declined","fulfilled"):
            offer.status = data["status"]
            item = db.get(WishlistItem, offer.wishlist_id)
            if data["status"] == "accepted" and item.status == "open":
                item.status = "reserved"
            if data["status"] == "fulfilled":
                item.status = "fulfilled"

        db.commit()
        return jsonify({"ok": True})
    finally:
        db.close()

# ---------- Main ----------

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=int(os.getenv("PORT", 5000)))
