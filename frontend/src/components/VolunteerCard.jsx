import React from "react";
import { useSupporter } from "../context/SupporterContext";

export default function VolunteerCard({ opportunity }) {
  const { registerEvent } = useSupporter();

  return (
    <div className="volunteer-card">
      <h4>{opportunity.title}</h4>
      <p>📅 {opportunity.date}</p>
      <p>📍 {opportunity.location}</p>
      <p>{opportunity.description}</p>
      <button
        className="btn register"
        onClick={() => registerEvent({ ...opportunity, status: "Volunteer" })}
      >
        Sign Up
      </button>
    </div>
  );
}
