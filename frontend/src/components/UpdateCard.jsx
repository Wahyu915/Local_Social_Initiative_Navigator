// src/components/UpdateCard.jsx
import React from "react";

export default function UpdateCard({ item, onClick }) {
  if (!item) return null;

  // ✅ fallback image
  const image =
    item.image ||
    `https://via.placeholder.com/640x400?text=${encodeURIComponent(
      item.title || "Update"
    )}`;

  // ✅ status badge logic
  let statusLabel = "";
  if (item.type === "event") {
    const eventDate = new Date(item.date);
    const now = new Date();
    statusLabel = eventDate >= now ? "Upcoming" : "Ended";
  } else if (item.type === "donation" || item.type === "volunteer") {
    statusLabel = item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Open";
  }

  // ✅ truncated description
  const truncate = (text, length = 100) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <div
      className="update-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      {/* Status Badge */}
      {statusLabel && <div className={`status-badge ${statusLabel.toLowerCase()}`}>{statusLabel}</div>}

      {/* Image */}
      <img src={image} alt={item.title} className="update-card-img" />

      {/* Content */}
      <div className="update-card-content">
        {/* Type Tag */}
        <span className={`type-tag ${item.type}`}>{item.type.toUpperCase()}</span>
        <h3>{item.title}</h3>

        {/* Meta info */}
        {item.type === "event" && (
          <p className="meta">
            📅 {new Date(item.date).toLocaleDateString("en-GB")}
            {item.time && ` • ${item.time}`} {item.location && `• ${item.location}`}
          </p>
        )}
        {item.type === "donation" && <p className="meta">💰 Donation Campaign</p>}
        {item.type === "volunteer" && <p className="meta">🙋 Volunteer Opportunity</p>}

        {/* Description */}
        <p className="desc">{truncate(item.description || item.details, 80)}</p>

        {/* Action Button */}
        {item.type === "event" && <button className="btn">Sign Up</button>}
        {item.type === "donation" && (
          <button className={`btn ${item.status === "closed" ? "disabled" : ""}`} disabled={item.status === "closed"}>
            {item.status === "closed" ? "Closed" : "Contribute"}
          </button>
        )}
        {item.type === "volunteer" && (
          <button className={`btn ${item.status === "closed" ? "disabled" : ""}`} disabled={item.status === "closed"}>
            {item.status === "closed" ? "Sign-ups Closed" : "Join"}
          </button>
        )}
      </div>
    </div>
  );
}
