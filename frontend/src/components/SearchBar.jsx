import React from "react";

export default function SearchBar({ searchTerm, setSearchTerm, filter, setFilter }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="">All</option>
        <option value="upcoming">Upcoming</option>
        <option value="past">Past</option>
        <option value="location">By Location</option>
      </select>
    </div>
  );
}
