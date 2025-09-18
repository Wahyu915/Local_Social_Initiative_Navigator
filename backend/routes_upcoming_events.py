# routes_upcoming_events.py
from flask import Blueprint, request, jsonify
from datetime import date as _date
from db import SessionLocal
from models import UpcomingEvent, NGO

bp_upcoming = Blueprint("upcoming_events", __name__, url_prefix="/api/events")

def _serialize(ev: UpcomingEvent):
    return {
        "id": ev.id,
        "ngo_id": ev.ngo_id,
        "ngo_name": ev.ngo.name if ev.ngo else None,
        "event_name": ev.event_name,
        "date": ev.event_date.isoformat(),
        "time": ev.event_time.strftime("%H:%M"),
        "location": ev.location,
        "organizer": ev.organizer or (ev.ngo.name if ev.ngo else None),
        "description": ev.description,
        "created_at": ev.created_at.isoformat() if ev.created_at else None,
        "updated_at": ev.updated_at.isoformat() if ev.updated_at else None,
    }

@bp_upcoming.get("")
def list_events():
    """
    Query params:
      - upcoming=1    -> only today and forward (default: show all)
      - ngo_id        -> filter by NGO
      - limit, offset
    """
    limit = min(int(request.args.get("limit", 20)), 100)
    offset = int(request.args.get("offset", 0))
    upcoming_only = request.args.get("upcoming") == "1"
    ngo_id = request.args.get("ngo_id", type=int)

    db = SessionLocal()
    try:
        q = db.query(UpcomingEvent).join(NGO, isouter=True)
        if upcoming_only:
            q = q.filter(UpcomingEvent.event_date >= _date.today())
        if ngo_id:
            q = q.filter(UpcomingEvent.ngo_id == ngo_id)

        q = q.order_by(UpcomingEvent.event_date.asc(), UpcomingEvent.event_time.asc())
        items = q.limit(limit).offset(offset).all()
        return jsonify({"items": [_serialize(i) for i in items], "limit": limit, "offset": offset})
    finally:
        db.close()

@bp_upcoming.post("")
def create_event():
    """
    JSON body:
      - event_name, date (YYYY-MM-DD), time (HH:MM), location
      - ngo_id (optional), organizer (optional), description (optional)
    """
    data = request.get_json(force=True)
    required = ["event_name", "date", "time", "location"]
    missing = [k for k in required if not data.get(k)]
    if missing:
        return jsonify({"error": f"missing fields: {', '.join(missing)}"}), 400

    db = SessionLocal()
    try:
        ngo_obj = None
        if data.get("ngo_id"):
            ngo_obj = db.get(NGO, int(data["ngo_id"]))
            if not ngo_obj:
                return jsonify({"error": "invalid ngo_id"}), 400

        from datetime import date as _date, time as _time
        d = _date.fromisoformat(data["date"])
        hh, mm = map(int, data["time"].split(":"))
        t = _time(hour=hh, minute=mm)

        ev = UpcomingEvent(
            ngo_id=int(data["ngo_id"]) if data.get("ngo_id") else None,
            event_name=data["event_name"].strip(),
            event_date=d,
            event_time=t,
            location=data["location"].strip(),
            organizer=(data.get("organizer") or "").strip() or (ngo_obj.name if ngo_obj else None),
            description=(data.get("description") or "").strip() or None,
        )
        db.add(ev)
        db.commit()
        db.refresh(ev)
        return jsonify(_serialize(ev)), 201
    finally:
        db.close()

@bp_upcoming.patch("/<int:event_id>")
def update_event(event_id):
    """Update an existing event"""
    # from app import require_admin
    # auth = require_admin()
    # if auth: return auth

    data = request.get_json(force=True)
    db = SessionLocal()
    try:
        ev = db.get(UpcomingEvent, event_id)
        if not ev:
            return jsonify({"error": "event not found"}), 404

        if "event_name" in data and data["event_name"]:
            ev.event_name = data["event_name"].strip()
        if "date" in data and data["date"]:
            from datetime import date as _date
            ev.event_date = _date.fromisoformat(data["date"])
        if "time" in data and data["time"]:
            from datetime import time as _time
            hh, mm = map(int, data["time"].split(":"))
            ev.event_time = _time(hour=hh, minute=mm)
        if "location" in data and data["location"]:
            ev.location = data["location"].strip()
        if "organizer" in data:
            ev.organizer = (data["organizer"] or "").strip() or ev.organizer
        if "description" in data:
            ev.description = (data["description"] or "").strip() or None
        if "ngo_id" in data and data["ngo_id"]:
            ngo_obj = db.get(NGO, int(data["ngo_id"]))
            if not ngo_obj:
                return jsonify({"error": "invalid ngo_id"}), 400
            ev.ngo_id = ngo_obj.id

        db.commit()
        db.refresh(ev)
        return jsonify(_serialize(ev))
    finally:
        db.close()

@bp_upcoming.delete("/<int:event_id>")
def delete_event(event_id):
    """Delete an event"""
    # from app import require_admin
    # auth = require_admin()
    # if auth: return auth

    db = SessionLocal()
    try:
        ev = db.get(UpcomingEvent, event_id)
        if not ev:
            return jsonify({"error": "event not found"}), 404
        db.delete(ev)
        db.commit()
        return jsonify({"ok": True})
    finally:
        db.close()

