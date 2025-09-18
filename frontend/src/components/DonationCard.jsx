import React from "react";

export default function DonationCard({ donation }) {
  return (
    <div className="donation-card">
      <h4>{donation.campaign}</h4>
      <p>💰 Amount: ${donation.amount}</p>
      <p>📅 Date: {donation.date}</p>
      <button className="btn">Donate Again</button>
    </div>
  );
}
