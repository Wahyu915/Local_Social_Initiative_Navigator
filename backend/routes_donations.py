# routes_donations.py
from flask import Blueprint, request, jsonify
from sqlalchemy import text
from db import SessionLocal
from models import WishlistItem, NGO
from datetime import date as _date

bp_donations = Blueprint("donations", __name__, url_prefix="/api/donations")

def _serialize(item: WishlistItem):
    return {
        "id": item.id,
        "ngo_id": item.ngo_id,
        "ngo_name": item.ngo.name if item.ngo else None,
        "title": item.title,
        "description": item.description,
        "details": item.description,
        "quantity": item.quantity,
        "unit": item.unit,
        "priority": item.priority,        # 'low' | 'normal' | 'high'
        "needed_by": item.needed_by.isoformat() if item.needed_by else None,
        "status": item.status,            # 'open' | 'reserved' | 'fulfilled' | 'cancelled'
        "created_at": item.created_at.isoformat() if item.created_at else None,
        "updated_at": item.updated_at.isoformat() if item.updated_at else None,
    }

@bp_donations.get("")
def list_donations():
    """
    Query params:
      - status=open/reserved/fulfilled/cancelled (default: open)
      - ngo_id
      - q (search title/description)
      - limit, offset
    """
    status = request.args.get("status", "open").strip().lower()
    ngo_id = request.args.get("ngo_id", type=int)
    q = request.args.get("q", "").strip()
    limit = min(int(request.args.get("limit", 20)), 100)
    offset = int(request.args.get("offset", 0))

    db = SessionLocal()
    try:
        query = db.query(WishlistItem).join(NGO, isouter=True)
        if status:
            query = query.filter(WishlistItem.status == status)
        if ngo_id:
            query = query.filter(WishlistItem.ngo_id == ngo_id)
        if q:
            likeq = f"%{q}%"
            query = query.filter((WishlistItem.title.ilike(likeq)) | (WishlistItem.description.ilike(likeq)))

        query = query.order_by(WishlistItem.priority.desc(), WishlistItem.created_at.desc())
        items = query.limit(limit).offset(offset).all()
        return jsonify({"items": [_serialize(i) for i in items], "limit": limit, "offset": offset})
    finally:
        db.close()

@bp_donations.post("")
def create_donation():
    """
    JSON:
      - title (required)
      - ngo_id (required)
      - description, quantity, unit, priority ('low'|'normal'|'high'), needed_by (YYYY-MM-DD)
      - status (default 'open')
    """
    data = request.get_json(force=True)
    missing = [k for k in ["title", "ngo_id"] if not data.get(k)]
    if missing:
        return jsonify({"error": f"missing fields: {', '.join(missing)}"}), 400

    db = SessionLocal()
    try:
        ngo_obj = db.get(NGO, int(data["ngo_id"]))
        if not ngo_obj:
            return jsonify({"error": "invalid ngo_id"}), 400

        needed_by = None
        if data.get("needed_by"):
            from datetime import date as _date
            needed_by = _date.fromisoformat(data["needed_by"])

        item = WishlistItem(
            ngo_id=ngo_obj.id,
            title=data["title"].strip(),
            description=(data.get("description") or "").strip() or None,
            quantity=int(data.get("quantity", 1)),
            unit=(data.get("unit") or "").strip() or None,
            priority=(data.get("priority") or "normal"),
            needed_by=needed_by,
            status=(data.get("status") or "open"),
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return jsonify(_serialize(item)), 201
    finally:
        db.close()

@bp_donations.patch("/<int:item_id>")
def update_donation(item_id):
    data = request.get_json(force=True)
    db = SessionLocal()
    try:
        item = db.get(WishlistItem, item_id)
        if not item:
            return jsonify({"error": "not found"}), 404

        for field in ["title", "description", "unit", "priority", "status"]:
            if field in data and data[field] is not None:
                val = data[field]
                item.__setattr__(field, val.strip() if isinstance(val, str) else val)

        if "quantity" in data and data["quantity"] is not None:
            item.quantity = int(data["quantity"])

        if "needed_by" in data:
            item.needed_by = _date.fromisoformat(data["needed_by"]) if data["needed_by"] else None

        if "ngo_id" in data and data["ngo_id"]:
            ngo_obj = db.get(NGO, int(data["ngo_id"]))
            if not ngo_obj:
                return jsonify({"error": "invalid ngo_id"}), 400
            item.ngo_id = ngo_obj.id

        db.commit()
        db.refresh(item)
        return jsonify(_serialize(item))
    finally:
        db.close()

@bp_donations.delete("/<int:item_id>")
def delete_donation(item_id):
    db = SessionLocal()
    try:
        item = db.get(WishlistItem, item_id)
        if not item:
            return jsonify({"error": "not found"}), 404
        db.delete(item)
        db.commit()
        return jsonify({"ok": True})
    finally:
        db.close()
