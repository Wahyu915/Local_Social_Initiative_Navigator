import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBox from "../components/ChatBox";
import { useUpdates } from "../context/UpdatesContext";
import EventCard from "../components/EventCard";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // NGO Profile state (local only for now)
  const [ngoProfile, setNgoProfile] = useState({
    name: "Green Brunei",
    logo_url: "",
    short_desc: "Making Brunei greener, one initiative at a time.",
    email: "contact@greenbrunei.org",
    phone: "+673 1234567",
    website: "https://greenbrunei.org",
    city: "Bandar Seri Begawan",
    district: "Brunei-Muara",
  });

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

  // Shared form state
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const resetForm = () => setFormData({});

  /* ---------- Handlers ---------- */
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    if (editingId) {
      await updateEvent(editingId, formData);
      setEditingId(null);
    } else {
      await addEvent(formData);
    }
    resetForm();
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingId) {
      await updateDonation(editingId, formData);
      setEditingId(null);
    } else {
      await addDonation(formData);
    }
    resetForm();
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingId) {
      await updateVolunteer(editingId, formData);
      setEditingId(null);
    } else {
      await addVolunteer(formData);
    }
    resetForm();
  };

  const startEdit = (item, type) => {
    setEditingId(item.id);
    setActiveTab(type);
    setFormData(item);
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <h2>NGO Dashboard</h2>
          <ul>
            <li className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>Overview</li>
            <li className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>Profile</li>
            <li className={activeTab === "events" ? "active" : ""} onClick={() => setActiveTab("events")}>Events</li>
            <li className={activeTab === "donations" ? "active" : ""} onClick={() => setActiveTab("donations")}>Donations</li>
            <li className={activeTab === "volunteers" ? "active" : ""} onClick={() => setActiveTab("volunteers")}>Volunteers</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Overview */}
          {activeTab === "overview" && (
            <div>
              <h3>Welcome back, {ngoProfile.name}! 👋</h3>
              <div className="stats-grid">
                <div className="stat-card"><h4>{events.length}</h4><p>Events</p></div>
                <div className="stat-card"><h4>{donations.length}</h4><p>Wishlist Items</p></div>
                <div className="stat-card"><h4>{volunteers.length}</h4><p>Volunteer Opps</p></div>
              </div>
              <h4>Recent Updates</h4>
              <ul>
                {events.slice(0, 3).map((e) => <li key={e.id}>📅 {e.title}</li>)}
                {donations.slice(0, 3).map((d) => <li key={d.id}>🎁 {d.title}</li>)}
                {volunteers.slice(0, 3).map((v) => <li key={v.id}>🙋 {v.title}</li>)}
              </ul>
            </div>
          )}

          {/* Profile */}
          {activeTab === "profile" && (
            <div>
              <h3>Manage Profile</h3>
              <form className="event-form">
                <input type="text" name="name" placeholder="NGO Name"
                  value={ngoProfile.name} onChange={(e) => setNgoProfile({ ...ngoProfile, name: e.target.value })} />
                <input type="text" name="logo_url" placeholder="Logo URL"
                  value={ngoProfile.logo_url} onChange={(e) => setNgoProfile({ ...ngoProfile, logo_url: e.target.value })} />
                <textarea name="short_desc" placeholder="Short Description"
                  value={ngoProfile.short_desc} onChange={(e) => setNgoProfile({ ...ngoProfile, short_desc: e.target.value })} />
                <input type="email" placeholder="Email"
                  value={ngoProfile.email} onChange={(e) => setNgoProfile({ ...ngoProfile, email: e.target.value })} />
                <input type="text" placeholder="Phone"
                  value={ngoProfile.phone} onChange={(e) => setNgoProfile({ ...ngoProfile, phone: e.target.value })} />
                <input type="text" placeholder="Website"
                  value={ngoProfile.website} onChange={(e) => setNgoProfile({ ...ngoProfile, website: e.target.value })} />
              </form>
              <div className="profile-preview">
                <h4>Preview</h4>
                <div className="ngo-card">
                  <img src={ngoProfile.logo_url || "/placeholder-logo.png"} alt="logo" />
                  <h3>{ngoProfile.name}</h3>
                  <p>{ngoProfile.short_desc}</p>
                </div>
              </div>
            </div>
          )}

          {/* Events */}
          {activeTab === "events" && (
            <div>
              <h3>Manage Events</h3>
              <form className="event-form" onSubmit={handleEventSubmit}>
                <input type="text" name="title" placeholder="Event Title" value={formData.title || ""} onChange={handleChange} />
                <input type="date" name="date" value={formData.date || ""} onChange={handleChange} />
                <input type="time" name="time" value={formData.time || ""} onChange={handleChange} />
                <input type="text" name="location" placeholder="Location" value={formData.location || ""} onChange={handleChange} />
                <textarea name="description" placeholder="Description" value={formData.description || ""} onChange={handleChange} />
                <button type="submit" className="btn">{editingId ? "Update" : "Add"} Event</button>
              </form>
              <div className="event-list">
                {events.map((e) => (
                  <div key={e.id} className="event-wrapper">
                    <EventCard event={e} />
                    <div className="event-actions">
                      <button className="btn secondary-btn" onClick={() => startEdit(e, "events")}>✏️ Edit</button>
                      <button className="btn danger-btn" onClick={() => deleteEvent(e.id)}>🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Donations */}
          {activeTab === "donations" && (
            <div>
              <h3>Manage Wishlist</h3>
              <form className="event-form" onSubmit={handleDonationSubmit}>
                <input type="text" name="title" placeholder="Item Title" value={formData.title || ""} onChange={handleChange} />
                <textarea name="description" placeholder="Description" value={formData.description || ""} onChange={handleChange} />
                <button type="submit" className="btn">{editingId ? "Update" : "Add"} Item</button>
              </form>
              <div className="event-list">
                {donations.map((d) => (
                  <div key={d.id} className="event-card">
                    <h3>{d.title}</h3>
                    <p>{d.description}</p>
                    <p>Status: {d.status}</p>
                    <div className="event-actions">
                      <button className="btn secondary-btn" onClick={() => startEdit(d, "donations")}>✏️ Edit</button>
                      <button className="btn danger-btn" onClick={() => deleteDonation(d.id)}>🗑️ Delete</button>
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
                <input type="text" name="title" placeholder="Opportunity Title" value={formData.title || ""} onChange={handleChange} />
                <textarea name="description" placeholder="Description" value={formData.description || ""} onChange={handleChange} />
                <button type="submit" className="btn">{editingId ? "Update" : "Add"} Opportunity</button>
              </form>
              <div className="event-list">
                {volunteers.map((v) => (
                  <div key={v.id} className="event-card">
                    <h3>{v.title}</h3>
                    <p>{v.description}</p>
                    <p>Status: {v.status}</p>
                    <div className="event-actions">
                      <button className="btn secondary-btn" onClick={() => startEdit(v, "volunteers")}>✏️ Edit</button>
                      <button className="btn danger-btn" onClick={() => deleteVolunteer(v.id)}>🗑️ Delete</button>
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



