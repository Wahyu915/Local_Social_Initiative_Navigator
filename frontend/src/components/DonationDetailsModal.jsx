// src/components/DonationDetailsModal.jsx
import React, { useState } from "react";

export default function DonationDetailsModal({ donation, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [thankYou, setThankYou] = useState(null);

  if (!donation) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setThankYou({ name, amount });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {!thankYou ? (
          <>
            <h2>{donation.title}</h2>
            <p>{donation.details || donation.description}</p>

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
              <input
                type="number"
                placeholder="Donation Amount (BND)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <button className="btn" type="submit">
                Contribute
              </button>
            </form>
          </>
        ) : (
          <div className="thankyou">
            <h2>🙏 Thank You!</h2>
            <p>
              Dear <strong>{thankYou.name}</strong>, your pledge of{" "}
              <strong>BND {thankYou.amount}</strong> has been recorded.
            </p>
            <p>We’ll contact you at {email} with payment details.</p>
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
