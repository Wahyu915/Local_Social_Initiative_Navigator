// src/components/VolunteerDetailsModal.jsx
import React, { useState } from "react";

export default function VolunteerDetailsModal({ volunteer, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [thankYou, setThankYou] = useState(null);

  if (!volunteer) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setThankYou({ name });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {!thankYou ? (
          <>
            <h2>{volunteer.title}</h2>
            <p>{volunteer.details || volunteer.description}</p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <textarea
                placeholder="Why do you want to volunteer?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="btn" type="submit">
                Sign Up
              </button>
            </form>
          </>
        ) : (
          <div className="thankyou">
            <h2>🎉 Thank You!</h2>
            <p>
              Dear <strong>{thankYou.name}</strong>, you’re signed up for{" "}
              <strong>{volunteer.title}</strong>.
            </p>
            <p>We’ll contact you at {email} with further details.</p>
            <button className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        )}
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
}
