import React, { useState } from "react";

export default function EventForm({ onAddEvent }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);

  // Handle banner image preview
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    setBanner(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewBanner(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      id: Date.now(),
      title,
      date,
      location,
      description,
      banner: previewBanner || "https://via.placeholder.com/640x400?text=Event",
    };

    onAddEvent(newEvent);

    // Reset form
    setTitle("");
    setDate("");
    setLocation("");
    setDescription("");
    setBanner(null);
    setPreviewBanner(null);
  };

  return (
    <div>
      <form className="event-form" onSubmit={handleSubmit}>
        <h2>Create / Edit Event</h2>

        <div>
          <label>Event Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event name"
            required
          />
        </div>

        <div className="form-row">
          <div>
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Eg. Muara Beach"
              required
            />
          </div>
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a short description"
            required
          />
        </div>

        <div>
          <label>Event Banner</label>
          <input type="file" accept="image/*" onChange={handleBannerChange} />
          {previewBanner && (
            <img
              src={previewBanner}
              alt="Preview Banner"
              className="banner-preview"
            />
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn">
            Save Event
          </button>
          <button
            type="button"
            className="btn secondary-btn"
            onClick={() => {
              setTitle("");
              setDate("");
              setLocation("");
              setDescription("");
              setBanner(null);
              setPreviewBanner(null);
            }}
          >
            Reset
          </button>
        </div>
      </form>

      {/* 🔹 Live Preview of Event Card (matches your Get Involved/Home cards) */}
      {title && (
        <div className="event-preview">
          <div className="event-card">
            {previewBanner && (
              <img src={previewBanner} alt={title} className="preview-img" />
            )}
            <h3>{title}</h3>
            <p>
              <strong>{date}</strong> • {location}
            </p>
            <p>{description}</p>
            <button className="btn">Learn More</button>
          </div>
        </div>
      )}
    </div>
  );
}
