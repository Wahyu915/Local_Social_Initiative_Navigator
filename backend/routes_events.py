from flask import Blueprint, request, jsonify
from datetime import date, time
from db import SessionLocal
from models import Event, NGO

bp_events = Blueprint("events", __name__, url_prefix="/api/events")

@bp_events.get("/")
def list_events():
    session = SessionLocal()
    try:
        events = session.query(Event).all()
        return jsonify([{
            "id": e.id,
            "event_name": e.event_name,
            "date": e.event_date.isoformat(),
            "time": e.event_time.strftime("%H:%M"),
            "location": e.location,
            "organizer": e.organizer,
            "description": e.description,
            "ngo_id": e.ngo_id,
        } for e in events])
    finally:
        session.close()
