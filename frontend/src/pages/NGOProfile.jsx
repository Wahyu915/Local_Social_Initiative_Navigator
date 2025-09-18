import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBox from "../components/ChatBox";
import { fetchNGOById } from "../lib/api";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaListAlt,
  FaHandsHelping,
  FaCalendarAlt,
} from "react-icons/fa";

export default function NGOProfile() {
  const { id } = useParams();
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNGOById(id)
      .then((data) => {
        // ✅ Handle both backend response shapes
        const ngoData = data.ngo || data;
        setNgo(ngoData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch NGO:", err);
        setError("Failed to load NGO details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading NGO details...</p>;
  if (error) return <p>{error}</p>;
  if (!ngo) return <p>NGO not found.</p>;

  return (
    <div>
      <Navbar />

      <div className="ngo-profile">
        {/* Header */}
        <div className="ngo-header">
          <img
            src={ngo.logo_url || "/placeholder-logo.png"}
            alt={ngo.name}
            className="ngo-profile-logo"
          />
          <h1>
            {ngo.name}
            {ngo.verified && (
              <FaCheckCircle className="verified-badge" title="Verified NGO" />
            )}
          </h1>
          {ngo.short_desc && <p className="ngo-short-desc">{ngo.short_desc}</p>}
        </div>

        {/* Full Description */}
        {ngo.full_desc && (
          <p className="ngo-full-desc">{ngo.full_desc}</p>
        )}

        {/* Tags */}
        {ngo.tags && ngo.tags.length > 0 && (
          <div className="ngo-tags">
            {ngo.tags.map((tag, idx) => (
              <span key={idx} className="tag-pill">
                {/* If backend sends tag object with .name, else fallback */}
                {tag.name || tag}
              </span>
            ))}
          </div>
        )}

        {/* Contact & Location */}
        <div className="ngo-contacts">
          {(ngo.city || ngo.district) && (
            <p>
              <FaMapMarkerAlt /> {ngo.city || ""}{" "}
              {ngo.district ? `, ${ngo.district}` : ""}
            </p>
          )}
          {ngo.email && (
            <p>
              <FaEnvelope /> {ngo.email}
            </p>
          )}
          {ngo.phone && (
            <p>
              <FaPhone /> {ngo.phone}
            </p>
          )}
          {ngo.website && (
            <p>
              <FaGlobe />{" "}
              <a href={ngo.website} target="_blank" rel="noreferrer">
                {ngo.website}
              </a>
            </p>
          )}
        </div>

        {/* Wishlist */}
        {ngo.wishlist_items && ngo.wishlist_items.length > 0 && (
          <section className="ngo-section">
            <h2>
              <FaListAlt /> Wishlist
            </h2>
            <ul>
              {ngo.wishlist_items.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  {item.description && ` – ${item.description}`}
                  {" ("}
                  {item.quantity} {item.unit || ""}, {item.status}
                  {")"}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Opportunities */}
        {ngo.opportunities && ngo.opportunities.length > 0 && (
          <section className="ngo-section">
            <h2>
              <FaHandsHelping /> Volunteer Opportunities
            </h2>
            <ul>
              {ngo.opportunities.map((opp) => (
                <li key={opp.id}>
                  <strong>{opp.title}</strong>
                  {opp.commitment && ` – ${opp.commitment}`}
                  <br />
                  {opp.description}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Upcoming Events */}
        {ngo.upcoming_events && ngo.upcoming_events.length > 0 && (
          <section className="ngo-section">
            <h2>
              <FaCalendarAlt /> Upcoming Events
            </h2>
            <ul>
              {ngo.upcoming_events.map((event) => (
                <li key={event.id}>
                  <strong>{event.event_name}</strong> – {event.location} <br />
                  {event.event_date} at {event.event_time}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <Footer />
      <ChatBox />
    </div>
  );
}
