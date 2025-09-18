// src/pages/Dashboard.jsx
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBox from "../components/ChatBox";
import { useUpdates } from "../context/UpdatesContext"; // ✅ updated
import EventCard from "../components/EventCard";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    donations,
    addDonation,
    updateDonation,
    deleteDonation,
    volunteers,
    addVolunteer,
    updateVolunteer,
    deleteVolunteer,
  } = useUpdates();

  // ---- Form state (shared) ----
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    status: "open",
  });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const resetForm = () =>
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      status: "open",
    });

  /* ---------- Submit Handlers ---------- */
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time || !formData.location) return;

    if (editingId) {
      await updateEvent(editingId, formData);
      setEditingId(null);
    } else {
      await addEvent(formData);
    }
    resetForm();
  };

  const handleDonationSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingId) {
      updateDonation(editingId, formData);
      setEditingId(null);
    } else {
      addDonation(formData);
    }
    resetForm();
  };

  const handleVolunteerSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingId) {
      updateVolunteer(editingId, formData);
      setEditingId(null);
    } else {
      addVolunteer(formData);
    }
    resetForm();
  };

  const startEdit = (item, type) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || "",
      date: item.date || "",
      time: item.time || "",
      location: item.location || "",
      description: item.description || item.details || "",
      status: item.status || "open",
    });
    setActiveTab(type);
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <h2>NGO Dashboard</h2>
          <ul>
            <li className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>Profile</li>
            <li className={activeTab === "events" ? "active" : ""} onClick={() => setActiveTab("events")}>Events</li>
            <li className={activeTab === "donations" ? "active" : ""} onClick={() => setActiveTab("donations")}>Donations</li>
            <li className={activeTab === "volunteers" ? "active" : ""} onClick={() => setActiveTab("volunteers")}>Volunteers</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Profile */}
          {activeTab === "profile" && (
            <div>
              <h3>Manage Profile</h3>
              <p>Update your NGO details here (name, description, contact info).</p>
            </div>
          )}

          {/* Events */}
          {activeTab === "events" && (
            <div>
              <h3>Manage Events</h3>
              <form className="event-form" onSubmit={handleEventSubmit}>
                <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} required />
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                <input type="text" name="location" placeholder="Event Location" value={formData.location} onChange={handleChange} required />
                <textarea name="description" placeholder="Event Description" value={formData.description} onChange={handleChange} />
                <button type="submit" className="btn">{editingId ? "Update Event" : "Add Event"}</button>
              </form>

              <div className="event-list">
                {events.map((event) => (
                  <div key={event.id} className="event-wrapper">
                    <EventCard event={{ ...event, image: event.image || `https://via.placeholder.com/640x400?text=${encodeURIComponent(event.title || "Event")}` }} />
                    <div className="event-actions">
                      <button className="btn secondary-btn" onClick={() => startEdit(event, "events")}>✏️ Edit</button>
                      <button className="btn danger-btn" onClick={() => deleteEvent(event.id)}>🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Donations */}
          {activeTab === "donations" && (
            <div>
              <h3>Manage Donations</h3>
              <form className="event-form" onSubmit={handleDonationSubmit}>
                <input type="text" name="title" placeholder="Donation Title" value={formData.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Donation Details" value={formData.description} onChange={handleChange} />
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
                <button type="submit" className="btn">{editingId ? "Update Donation" : "Add Donation"}</button>
              </form>

              <div className="event-list">
                {donations.map((don) => (
                  <div key={don.id} className="event-wrapper">
                    <div className="event-card">
                      <h3>{don.title}</h3>
                      <p>{don.details || don.description}</p>
                      <p>Status: {don.status}</p>
                    </div>
                    <div className="event-actions">
                      <button className="btn secondary-btn" onClick={() => startEdit(don, "donations")}>✏️ Edit</button>
                      <button className="btn danger-btn" onClick={() => deleteDonation(don.id)}>🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Volunteers */}
          {activeTab === "volunteers" && (
            <div>
              <h3>Manage Volunteers</h3>
              <form className="event-form" onSubmit={handleVolunteerSubmit}>
                <input type="text" name="title" placeholder="Volunteer Title" value={formData.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Volunteer Details" value={formData.description} onChange={handleChange} />
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
                <button type="submit" className="btn">{editingId ? "Update Volunteer" : "Add Volunteer"}</button>
              </form>

              <div className="event-list">
                {volunteers.map((vol) => (
                  <div key={vol.id} className="event-wrapper">
                    <div className="event-card">
                      <h3>{vol.title}</h3>
                      <p>{vol.details || vol.description}</p>
                      <p>Status: {vol.status}</p>
                    </div>
                    <div className="event-actions">
                      <button className="btn secondary-btn" onClick={() => startEdit(vol, "volunteers")}>✏️ Edit</button>
                      <button className="btn danger-btn" onClick={() => deleteVolunteer(vol.id)}>🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
      <ChatBox />
    </div>
  );
}


