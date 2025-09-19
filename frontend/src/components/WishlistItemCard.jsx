// src/components/WishlistItemCard.jsx
import React from "react";
import { FaBoxOpen, FaClock, FaFlag } from "react-icons/fa";

export default function WishlistItemCard({ item, onDonate }) {
  const priorityClass =
    item.priority === "high" ? "priority-high"
    : item.priority === "low" ? "priority-low"
    : "priority-normal";

  return (
    <div className="wishlist-card">
      <div className="wishlist-main">
        <h4 className="wishlist-title">
          <FaBoxOpen /> {item.title}
        </h4>
        {item.description && <p className="wishlist-desc">{item.description}</p>}

        <div className="wishlist-meta">
          <span className={`wishlist-chip ${priorityClass}`}>
            <FaFlag /> Priority: <strong>{item.priority || "normal"}</strong>
          </span>
          <span className="wishlist-chip">
            Qty: <strong>{item.quantity}</strong> {item.unit || ""}
          </span>
          {item.needed_by && (
            <span className="wishlist-chip">
              <FaClock /> Needed by: <strong>{item.needed_by}</strong>
            </span>
          )}
          <span className={`wishlist-status ${item.status}`}>{item.status}</span>
        </div>
      </div>

      <div className="wishlist-actions">
        <button
          className="btn donate"
          disabled={item.status === "fulfilled" || item.status === "cancelled"}
          onClick={() => onDonate?.(item)}
        >
          I want to help
        </button>
      </div>
    </div>
  );
}
