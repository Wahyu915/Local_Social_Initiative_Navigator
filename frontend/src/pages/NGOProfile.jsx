// src/pages/NGOProfile.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBox from "../components/ChatBox";
import DonationDetailsModal from "../components/DonationDetailsModal";
import WishlistItemCard from "../components/WishlistItemCard";

import {
  fetchNGOById,
  fetchDonationsByNGO,
  fetchEventsByNGO,
  fetchVolunteersByNGO,
} from "../lib/api";

import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaListAlt,
  FaHandsHelping,
  FaCalendarAlt,
  FaUsers,
  FaLeaf,
  FaGraduationCap,
  FaPaintBrush,
  FaBalanceScale,
  FaHeart,
} from "react-icons/fa";

export default function NGOProfile() {
  const { id } = useParams();
  const [ngo, setNgo] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [wLoading, setWLoading] = useState(true);
  const [eLoading, setELoading] = useState(true);
  const [vLoading, setVLoading] = useState(true);

  const [error, setError] = useState(null);
  const [activeDonation, setActiveDonation] = useState(null);

  const locationStr = useMemo(
    () => [ngo?.city, ngo?.district].filter(Boolean).join(", "),
    [ngo]
  );

  // ✅ Category → icon mapping
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

  // ✅ Load NGO
  useEffect(() => {
    let cancelled = false;
    async function loadNGO() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNGOById(id);
        const ngoData = data.ngo || data;
        if (!cancelled) setNgo(ngoData);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("⚠️ Failed to load NGO details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadNGO();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // ✅ Load Wishlist
  useEffect(() => {
    let cancelled = false;
    async function loadWishlist() {
      setWLoading(true);
      try {
        const items = await fetchDonationsByNGO(id, { status: "open" });
        if (!cancelled) setWishlist(items);
      } catch (e) {
        console.error("Failed to load wishlist", e);
        if (!cancelled) setWishlist([]);
      } finally {
        if (!cancelled) setWLoading(false);
      }
    }
    if (id) loadWishlist();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // ✅ Load Events
  useEffect(() => {
    let cancelled = false;
    async function loadEvents() {
      setELoading(true);
      try {
        const items = await fetchEventsByNGO(id, { upcoming: true });
        if (!cancelled) setEvents(items);
      } catch (e) {
        console.error("Failed to load events", e);
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setELoading(false);
      }
    }
    if (id) loadEvents();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // ✅ Load Volunteers
  useEffect(() => {
    let cancelled = false;
    async function loadVolunteers() {
      setVLoading(true);
      try {
        const items = await fetchVolunteersByNGO(id, { active: true });
        if (!cancelled) setVolunteers(items);
      } catch (e) {
        console.error("Failed to load volunteers", e);
        if (!cancelled) setVolunteers([]);
      } finally {
        if (!cancelled) setVLoading(false);
      }
    }
    if (id) loadVolunteers();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p>⏳ Loading NGO details…</p>;
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
          <h1 className="ngo-name">
            {ngo.name}{" "}
            {ngo.verified && (
              <FaCheckCircle className="verified-badge" title="Verified NGO" />
            )}
          </h1>
          {ngo.short_desc && (
            <p className="ngo-short-desc">{ngo.short_desc}</p>
          )}
        </div>

        {/* ✅ Full Description as its own section */}
        {ngo.full_desc && (
          <section className="ngo-section">
            <h2>About this NGO</h2>
            <p className="ngo-full-desc">{ngo.full_desc}</p>
          </section>
        )}

        {/* ✅ Tags with icons */}
        {Array.isArray(ngo.tags) && ngo.tags.length > 0 && (
          <div className="ngo-tags">
            {ngo.tags.map((tag, idx) => (
              <span key={idx} className="tag-pill">
                {categoryIcons[tag] || <FaUsers />} {tag?.name || tag}
              </span>
            ))}
          </div>
        )}

        {/* Contact Info */}
        <div className="ngo-contacts">
          {locationStr && (
            <p>
              <FaMapMarkerAlt /> {locationStr}
            </p>
          )}
          {ngo.email && (
            <p>
              <FaEnvelope />{" "}
              <a href={`mailto:${ngo.email}`}>{ngo.email}</a>
            </p>
          )}
          {ngo.phone && (
            <p>
              <FaPhone /> <a href={`tel:${ngo.phone}`}>{ngo.phone}</a>
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
        <section className="ngo-section">
          <h2>
            <FaListAlt /> Wishlist
          </h2>
          {wLoading ? (
            <p>⏳ Loading wishlist…</p>
          ) : wishlist.length === 0 ? (
            <p>📭 This NGO has no open wishlist items.</p>
          ) : (
            <div className="wishlist-grid">
              {wishlist.map((item) => (
                <WishlistItemCard
                  key={item.id}
                  item={item}
                  onDonate={(it) => setActiveDonation(it)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Volunteer Opportunities */}
        <section className="ngo-section">
          <h2>
            <FaHandsHelping /> Volunteer Opportunities
          </h2>
          {vLoading ? (
            <p>⏳ Loading opportunities…</p>
          ) : volunteers.length === 0 ? (
            <p>🙅 No open volunteer opportunities.</p>
          ) : (
            <div className="simple-grid">
              {volunteers.map((opp) => (
                <div key={opp.id} className="simple-card">
                  <strong>{opp.title}</strong>
                  {opp.commitment && <p>{opp.commitment}</p>}
                  <p>{opp.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming Events */}
        <section className="ngo-section">
          <h2>
            <FaCalendarAlt /> Upcoming Events
          </h2>
          {eLoading ? (
            <p>⏳ Loading events…</p>
          ) : events.length === 0 ? (
            <p>🙅 No upcoming events.</p>
          ) : (
            <div className="simple-grid">
              {events.map((event) => (
                <div key={event.id} className="simple-card">
                  <strong>{event.title}</strong>
                  <p>
                    {event.date} {event.time && `at ${event.time}`}
                  </p>
                  <p>{event.location}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Donation modal */}
      {activeDonation && (
        <DonationDetailsModal
          donation={activeDonation}
          onClose={() => setActiveDonation(null)}
        />
      )}

      <Footer />
      <ChatBox />
    </div>
  );
}



