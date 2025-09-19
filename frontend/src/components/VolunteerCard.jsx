// src/components/VolunteerCard.jsx
import React from "react";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function VolunteerCard({ opportunity }) {
  return (
    <div className="volunteer-card">
      <h4>{opportunity.title}</h4>
      <p className="meta">
        <FaCalendarAlt /> {opportunity.date}
        <br />
        <FaMapMarkerAlt /> {opportunity.location}
      </p>
      <p>{opportunity.description}</p>
      <button className="btn">Sign Up</button>
    </div>
  );
}

