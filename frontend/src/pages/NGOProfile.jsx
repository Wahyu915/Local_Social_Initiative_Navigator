import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Section from "../components/Section";
import { getNGO, getWishlistByNGO } from "../lib/api";
import "./ngo-profile.css";
import {
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
} from "react-icons/fa";

function initialsFrom(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join("");
}

function domainOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url?.replace(/^https?:\/\//, "") || "";
  }
}

export default function NGOProfile() {
  const { id } = useParams();
  const [ngo, setNgo] = useState(null);
  const [tags, setTags] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        const d = await getNGO(id);
        if (cancel) return;
        setNgo(d.ngo);
        setTags(d.tags || []);
        const w = await getWishlistByNGO(id, { limit: 24 });
        if (cancel) return;
        setItems(w.items || []);
      } catch (e) {
        if (!cancel) setErr("NGO not found");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [id]);

  const locationLine = useMemo(() => {
    if (!ngo) return "";
    const parts = [ngo.city, ngo.district].filter(Boolean);
    return parts.join(", ");
  }, [ngo]);

  return (
    <>
      <Navbar />

      <Section>
        {loading && <div className="np-skeleton">Loading profile…</div>}
        {err && <p className="np-error">{err}</p>}

        {ngo && (
          <div className="np-container">
            {/* Back button */}
            <button
              onClick={() => navigate("/discover")}
              className="np-back"
              aria-label="Back to Discover"
            >
              <FaArrowLeft />
            </button>

            {/* Cover + header */}
            <div className="np-cover" />

            <div className="np-header card">
              <div className="np-avatar" aria-hidden="true">
                {ngo.logo_url ? (
                  <img src={ngo.logo_url} alt={`${ngo.name} logo`} />
                ) : (
                <span>{initialsFrom(ngo.name)}</span>
                )}
              </div>

              <div className="np-heading">
                <h1 className="np-name">{ngo.name}</h1>
                {locationLine && <div className="np-location">{locationLine}</div>}

                {tags.length > 0 && (
                  <div className="np-tags">
                    {tags.map((t) => (
                      <span key={t.key || t.name} className="np-tag">
                        {t.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="np-actions">
                  {ngo.website && (
                    <a
                      className="btn primary"
                      href={ngo.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit website &middot; {domainOf(ngo.website)}
                    </a>
                  )}
                  {ngo.email && (
                    <a className="btn" href={`mailto:${ngo.email}`}>
                      Email
                    </a>
                  )}
                  {ngo.phone && <span className="btn muted">{ngo.phone}</span>}
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="np-layout">
              <div className="np-main">
                {/* About / Summary */}
                {(ngo.short_desc || ngo.full_desc) && (
                  <div className="card np-about">
                    <h2>About</h2>
                    {ngo.short_desc && (
                      <p className="np-text">{ngo.short_desc}</p>
                    )}
                    {ngo.full_desc && (
                      <p className="np-text">{ngo.full_desc}</p>
                    )}
                  </div>
                )}

                {/* Wishlist */}
                <div className="card np-wishlist">
                  <div className="np-section-title">
                    <h2>Wishlist</h2>
                    {items.length > 0 && (
                      <span className="np-count">{items.length}</span>
                    )}
                  </div>

                  {items.length === 0 ? (
                    <p className="np-muted">No items yet.</p>
                  ) : (
                    <ul className="np-grid">
                      {items.map((it) => (
                        <li key={it.id} className="np-wish">
                          <div className="np-wish-title">{it.title}</div>
                          {it.description && (
                            <div className="np-wish-desc">{it.description}</div>
                          )}
                          <div className="np-wish-meta">
                            {it.quantity || 1} {it.unit || ""} · Priority:{" "}
                            {it.priority} · Status: {it.status}
                          </div>
                          <Link
                            to={`/wishlist/${it.id}`}
                            className="btn small primary"
                          >
                            Offer to help
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <aside className="np-side">
                <div className="card np-info">
                  <h3>Contact</h3>
                  <ul className="np-list">
                    {ngo.website && (
                      <li>
                        <FaGlobe className="np-icon" />
                        <a href={ngo.website} target="_blank" rel="noreferrer">
                          {domainOf(ngo.website)}
                        </a>
                      </li>
                    )}
                    {ngo.email && (
                      <li>
                        <FaEnvelope className="np-icon" />
                        <a href={`mailto:${ngo.email}`}>{ngo.email}</a>
                      </li>
                    )}
                    {ngo.phone && (
                      <li>
                        <FaPhone className="np-icon" />
                        <span>{ngo.phone}</span>
                      </li>
                    )}
                    {locationLine && (
                      <li>
                        <FaMapMarkerAlt className="np-icon" />
                        <span>{locationLine}</span>
                      </li>
                    )}
                    <li>
                      {ngo.verified ? (
                        <>
                          <FaCheckCircle className="np-icon text-green-600" />
                          <span className="np-badge ok">Yes</span>
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="np-icon text-red-600" />
                          <span className="np-badge no">No</span>
                        </>
                      )}
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        )}
      </Section>

      <Footer />
    </>
  );
}
