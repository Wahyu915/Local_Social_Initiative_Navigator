// src/components/FeaturedCarousel.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Card from "./Card";
import { fetchNGOs } from "../lib/api";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function FeaturedCarousel({ title = "Featured NGOs", limit = 10 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const all = await fetchNGOs({ limit: 50 });
        const featured = all
          .sort((a, b) => Number(b.verified) - Number(a.verified))
          .slice(0, limit);
        if (!cancelled) setItems(featured);
      } catch (e) {
        console.error("Failed to load featured NGOs", e);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="featured-section">
      <h2>{title}</h2>

      {loading ? (
        <p>Loading featured NGOs…</p>
      ) : items.length === 0 ? (
        <p>No featured NGOs yet.</p>
      ) : (
        <>
          <Slider {...sliderSettings}>
            {items.map((ngo) => (
              <div key={ngo.id} className="ngo-slide">
                <Card
                  id={ngo.id}
                  title={ngo.name}
                  description={ngo.short_desc}
                  category={ngo.category || null}
                  city={ngo.city}
                  district={ngo.district}
                  verified={ngo.verified}
                  logo_url={ngo.logo_url}
                  tags={ngo.tags || []}
                />
              </div>
            ))}
          </Slider>

          {/* ✅ View All NGOs Button */}
          <div className="view-all-wrapper">
            <Link to="/discover" className="btn view-all-btn">
              View All NGOs
            </Link>
          </div>
        </>
      )}
    </section>
  );
}


