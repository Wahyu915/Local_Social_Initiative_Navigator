# routes_volunteers.py
from flask import Blueprint, request, jsonify
from db import SessionLocal
from models import Opportunity, NGO
from datetime import date as _date

bp_volunteers = Blueprint("volunteers", __name__, url_prefix="/api/volunteers")

def _status_from_dates(starts_on, ends_on):
    today = _date.today()
    if ends_on and ends_on < today:
        return "closed"
    return "open"

def _serialize(op: Opportunity):
    loc = ", ".join([p for p in [op.city, op.district] if p])
    return {
        "id": op.id,
        "ngo_id": op.ngo_id,
        "ngo_name": op.ngo.name if op.ngo else None,
        "title": op.title,
        "description": op.description,
        "details": op.description,
        "commitment": op.commitment,
        "city": op.city,
        "district": op.district,
        "location": loc if loc else None,
        "start_date": op.starts_on.isoformat() if op.starts_on else None,
        "end_date": op.ends_on.isoformat() if op.ends_on else None,
        "status": _status_from_dates(op.starts_on, op.ends_on),  # 'open' | 'closed'
        "created_at": op.created_at.isoformat() if op.created_at else None,
    }

@bp_volunteers.get("")
def list_volunteers():
    """
    Query params:
      - active=1 -> only opportunities not ended yet
      - ngo_id
      - q (search title/description/commitment/city/district)
      - limit, offset
    """
    active_only = request.args.get("active") == "1"
    ngo_id = request.args.get("ngo_id", type=int)
    q = request.args.get("q", "").strip()
    limit = min(int(request.args.get("limit", 20)), 100)
    offset = int(request.args.get("offset", 0))

    db = SessionLocal()
    try:
        query = db.query(Opportunity).join(NGO, isouter=True)
        if active_only:
            # Show items with no end_date OR end_date >= today
            today = _date.today()
            query = query.filter((Opportunity.ends_on == None) | (Opportunity.ends_on >= today))  # noqa: E711
        if ngo_id:
            query = query.filter(Opportunity.ngo_id == ngo_id)
        if q:
            likeq = f"%{q}%"
            query = query.filter(
                (Opportunity.title.ilike(likeq)) |
                (Opportunity.description.ilike(likeq)) |
                (Opportunity.commitment.ilike(likeq)) |
                (Opportunity.city.ilike(likeq)) |
                (Opportunity.district.ilike(likeq))
            )

        query = query.order_by(Opportunity.starts_on.asc().nulls_last())
        items = query.limit(limit).offset(offset).all()
        return jsonify({"items": [_serialize(i) for i in items], "limit": limit, "offset": offset})
    finally:
        db.close()

@bp_volunteers.post("")
def create_volunteer():
    """
    JSON:
      - title (required)
      - ngo_id (optional)
      - description, commitment, city, district
      - start_date (YYYY-MM-DD) optional
      - end_date (YYYY-MM-DD) optional
    """
    data = request.get_json(force=True)
    if not data.get("title"):
        return jsonify({"error": "title required"}), 400

    db = SessionLocal()
    try:
        ngo_obj = None
        if data.get("ngo_id"):
            ngo_obj = db.get(NGO, int(data["ngo_id"]))
            if not ngo_obj:
                return jsonify({"error": "invalid ngo_id"}), 400

        starts_on = None
        ends_on = None
        if data.get("start_date"):
            starts_on = _date.fromisoformat(data["start_date"])
        if data.get("end_date"):
            ends_on = _date.fromisoformat(data["end_date"])

        op = Opportunity(
            ngo_id = ngo_obj.id if ngo_obj else None,
            title = data["title"].strip(),
            description = (data.get("description") or "").strip() or None,
            commitment = (data.get("commitment") or "").strip() or None,
            city = (data.get("city") or "").strip() or None,
            district = (data.get("district") or "").strip() or None,
            starts_on = starts_on,
            ends_on = ends_on,
        )
        db.add(op)
        db.commit()
        db.refresh(op)
        return jsonify(_serialize(op)), 201
    finally:
        db.close()

@bp_volunteers.patch("/<int:op_id>")
def update_volunteer(op_id):
    data = request.get_json(force=True)
    db = SessionLocal()
    try:
        op = db.get(Opportunity, op_id)
        if not op:
            return jsonify({"error": "not found"}), 404

        for field in ["title", "description", "commitment", "city", "district"]:
            if field in data:
                val = data[field]
                op.__setattr__(field, (val or "").strip() or None)

        if "ngo_id" in data and data["ngo_id"]:
            ngo_obj = db.get(NGO, int(data["ngo_id"]))
            if not ngo_obj:
                return jsonify({"error": "invalid ngo_id"}), 400
            op.ngo_id = ngo_obj.id

        if "start_date" in data:
            op.starts_on = _date.fromisoformat(data["start_date"]) if data["start_date"] else None
        if "end_date" in data:
            op.ends_on = _date.fromisoformat(data["end_date"]) if data["end_date"] else None

        db.commit()
        db.refresh(op)
        return jsonify(_serialize(op))
    finally:
        db.close()

@bp_volunteers.delete("/<int:op_id>")
def delete_volunteer(op_id):
    db = SessionLocal()
    try:
        op = db.get(Opportunity, op_id)
        if not op:
            return jsonify({"error": "not found"}), 404
        db.delete(op)
        db.commit()
        return jsonify({"ok": True})
    finally:
        db.close()
