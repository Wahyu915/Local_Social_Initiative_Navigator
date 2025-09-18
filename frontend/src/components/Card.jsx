import React from "react"
import { Link } from "react-router-dom"
import {
  FaLeaf,
  FaUsers,
  FaHandsHelping,
  FaGraduationCap,
  FaPaintBrush,
  FaBalanceScale,
  FaHeart,
} from "react-icons/fa"

export default function Card({ title, category, link }) {
  // Small icon mapping by category (unchanged)
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
  }

  return (
    <div className="ngo-card">
      <h3>
        {/* Title is clickable if link is provided; otherwise plain text */}
        {link ? (
          <Link to={link} className="ngo-title-link" title={title}>
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>

      {category && (
        <p className="ngo-category">
          {(categoryIcons[category] ?? null)} <span>{category}</span>
        </p>
      )}

      {/* Use React Router for client-side navigation (keeps your 'btn' styling) */}
      {link && (
        <Link to={link} className="btn" aria-label={`View ${title} profile`}>
          View Profile
        </Link>
      )}
    </div>
  )
}
