import React, { useState } from "react";
import { useSupporter } from "../context/SupporterContext";

export default function EventCard({ event }) {
  const { addBookmark, registerEvent } = useSupporter();
  const [showModal, setShowModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleRegister = (e) => {
    e.preventDefault();
    registerEvent({ ...event, status: "Registered" });
    setShowRegister(false);
    alert(`You have registered for ${event.title}!`);
  };

  return (
    <>
      {/* Event Card */}
      <div className="event-card">
        <img
          src={
            event.image ||
            `https://via.placeholder.com/640x400?text=${encodeURIComponent(
              event.title || "Event"
            )}`
          }
          alt={event.title}
          className="event-image"
        />

        <div className="event-content">
          <h3 className="event-title">{event.title}</h3>
          <p className="event-date">
            📅 {event.date} {event.time && `• ${event.time}`}
          </p>
          <p className="event-location">📍 {event.location}</p>
          <p className="event-description">{event.description}</p>

          <div className="event-actions">
            <button className="btn learn-more" onClick={() => setShowModal(true)}>
              Learn More
            </button>
            <button className="btn register" onClick={() => setShowRegister(true)}>
              Register
            </button>
            <button
              className="btn bookmark"
              onClick={() =>
                addBookmark({ id: event.id, type: "Event", name: event.title })
              }
            >
              ⭐ Bookmark
            </button>
          </div>
        </div>
      </div>

      {/* Learn More Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{event.title}</h2>
            <p>
              <strong>Date:</strong> {event.date} {event.time && `• ${event.time}`}
            </p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            <p>
              <strong>Details:</strong> {event.details || event.description}
            </p>
            <button className="btn close" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="modal-overlay" onClick={() => setShowRegister(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Register for {event.title}</h2>
            <form onSubmit={handleRegister} className="register-form">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <button type="submit" className="btn">
                Confirm
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
