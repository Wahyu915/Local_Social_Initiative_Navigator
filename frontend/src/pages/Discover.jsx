// src/pages/Discover.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBox from "../components/ChatBox";
import Section from "../components/Section";
import Card from "../components/Card";
import { fetchNGOs } from "../lib/api";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [visibleCount, setVisibleCount] = useState(10);

  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Category color mapping
  const categoryColors = {
    "Animal Rights": "#e57373",
    "Arts & Creatives": "#ba68c8",
    "Community": "#64b5f6",
    "Education": "#81c784",
    "Health": "#ffb74d",
    "Environment": "#4db6ac",
    "Youth Development": "#9575cd",
    "Human Rights": "#f06292",
    default: "#1e398a",
  };

  // ✅ Fetch & normalize NGOs
  useEffect(() => {
    setLoading(true);
    fetchNGOs()
      .then((data) => {
        const normalized = data.map((ngo) => {
          let tags = ngo.tags || [];
          if (ngo.category && !tags.includes(ngo.category)) {
            tags = [...tags, ngo.category];
          }
          return {
            ...ngo,
            category: ngo.category || "General",
            tags,
          };
        });
        setNgos(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching NGOs:", err);
        setError("Failed to load NGOs. Please try again later.");
        setLoading(false);
      });
  }, []);

  // ✅ Categories (from tags)
  const categories = [
    "all",
    ...Array.from(new Set(ngos.flatMap((ngo) => ngo.tags))),
  ];

  // ✅ Districts
  const districts = [
    "all",
    ...Array.from(new Set(ngos.map((ngo) => ngo.district || "Unspecified"))),
  ];

  // ✅ Filter NGOs
  const filteredNGOs = ngos.filter((ngo) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      ngo.name?.toLowerCase().includes(searchLower) ||
      ngo.city?.toLowerCase().includes(searchLower) ||
      ngo.tags?.some((tag) => tag.toLowerCase().includes(searchLower));

    const matchesCategory =
      selectedCategory === "all" || ngo.tags?.includes(selectedCategory);

    const matchesDistrict =
      selectedDistrict === "all" ||
      ngo.district === selectedDistrict ||
      (selectedDistrict === "Unspecified" && !ngo.district);

    return matchesSearch && matchesCategory && matchesDistrict;
  });

  const visibleNGOs = filteredNGOs.slice(0, visibleCount);

  // ✅ Helper for "New" badge
  const isNewNGO = (createdAt) => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return createdDate.getTime() > thirtyDaysAgo;
  };

  // ✅ Reset Filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDistrict("all");
  };

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <div className="discover-hero">
        <div className="discover-hero-overlay">
          <h1>Discover NGOs</h1>
          <p>Find organizations making a difference in Brunei.</p>
        </div>
      </div>

      {/* Main Section */}
      <Section className="discover-section">
        {/* Filters Row */}
        <div className="filters-row">
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Search NGOs by name, city, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="district-filter">
            <select
              id="district"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              {districts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist === "all" ? "All Districts" : dist}
                </option>
              ))}
            </select>
          </div>

          <button className="reset-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>

        {/* Categories Row */}
        <div className="category-tags">
          {categories.map((cat) => {
            const color = categoryColors[cat] || categoryColors.default;
            return (
              <button
                key={cat}
                className={`tag ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  borderColor: color,
                  color: selectedCategory === cat ? "#fff" : color,
                  background: selectedCategory === cat ? color : "#fff",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* NGO Count */}
        <p className="ngo-count">
          Showing {visibleNGOs.length} of {filteredNGOs.length} NGOs
        </p>

        {/* NGO Grid */}
        {loading ? (
          <p>Loading NGOs...</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : filteredNGOs.length > 0 ? (
          <InfiniteScroll
            dataLength={visibleNGOs.length}
            next={() => setVisibleCount(visibleCount + 6)}
            hasMore={visibleCount < filteredNGOs.length}
            loader={<p className="loading-msg">Loading more NGOs...</p>}
            endMessage={
              <p className="end-results">
                🎉 You’ve reached the end of the results.
              </p>
            }
          >
            <div className="card-grid">
              {visibleNGOs.map((ngo) => (
                <Card
                  key={ngo.id}
                  id={ngo.id}
                  title={ngo.name}
                  description={ngo.short_desc}
                  category={ngo.category}
                  city={ngo.city}
                  district={ngo.district}
                  verified={ngo.verified}
                  logo_url={ngo.logo_url}
                  tags={ngo.tags}
                  isNew={isNewNGO(ngo.created_at)}
                />
              ))}
            </div>
          </InfiniteScroll>
        ) : (
          <p className="empty-state">
            🤔 No NGOs match your filters. Try adjusting your search or filters.
          </p>
        )}
      </Section>

      <Footer />
      <ChatBox />
    </div>
  );
}




