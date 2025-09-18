import React from "react";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaUsers,
  FaHandsHelping,
  FaGraduationCap,
  FaPaintBrush,
  FaBalanceScale,
  FaHeart,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaStar,
} from "react-icons/fa";

export default function Card({
  id,
  title,
  description,
  category,
  city,
  district,
  verified,
  logo_url,
  tags = [],
  isNew = false,
}) {
  const categoryIcons = {
    "Animal Rights": <FaHeart />,
    "Arts & Creatives": <FaPaintBrush />,
    "Community": <FaUsers />,
    "Disaster Relief": <FaHandsHelping />,
    "Education": <FaGraduationCap />,
    "Green Initiative": <FaLeaf />,
    "Social Entrepreneurship": <FaBalanceScale />,
    "Spiritual & Religion": <FaHandsHelping />,
    "Youth Development": <FaUsers />,
    "Health": <FaHeart />,
    "Elderly Care": <FaUsers />,
    "Disability Services": <FaHandsHelping />,
    "Human Rights & Legal Aid": <FaBalanceScale />,
    "Culture & Heritage": <FaPaintBrush />,
    "Technology & Digital Literacy": <FaGraduationCap />,
  };

  return (
    <Link to={`/ngo/${id}`} className="ngo-card">
      {/* Top-right New badge */}
      {isNew && (
        <div className="card-header">
          <span className="new-badge">
            <FaStar /> New
          </span>
        </div>
      )}

      {/* Logo */}
      <img
        src={logo_url || "/placeholder-logo.png"}
        alt={title}
        className="ngo-logo"
      />

      {/* NGO Title */}
      <h3 className="ngo-title">
        {title}
        {verified && (
          <FaCheckCircle className="verified-badge" title="Verified NGO" />
        )}
      </h3>

      {/* Short Description */}
      <p className="ngo-description">
        {description || "No description available."}
      </p>

      {/* Tags */}
      <div className="ngo-tags">
        {tags && tags.length > 0 ? (
          tags.map((tag, idx) => (
            <span key={idx} className="tag-pill">
              {categoryIcons[tag] || <FaUsers />} {tag}
            </span>
          ))
        ) : (
          <span className="tag-pill">Uncategorized</span>
        )}
      </div>

      {/* Location */}
      <p className="ngo-location">
        {city || district ? (
          <>
            <FaMapMarkerAlt /> {city}
            {district ? `, ${district}` : ""}
          </>
        ) : (
          "Location unavailable"
        )}
      </p>
    </Link>
  );
}


