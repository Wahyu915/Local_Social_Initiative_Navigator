import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSupporter } from "../context/SupporterContext";
import EventCard from "../components/EventCard";
import DonationCard from "../components/DonationCard";
import VolunteerCard from "../components/VolunteerCard";
import SearchBar from "../components/SearchBar";
import { isBefore, parseISO } from "date-fns";

export default function SupporterDashboard() {
  const {
    profile,
    updateProfile,
    myEvents,
    donations,
    bookmarks,
    notifications,
  } = useSupporter();

  const [activeTab, setActiveTab] = useState("overview");
  const [editProfile, setEditProfile] = useState(profile);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateProfile(editProfile);
    alert("Profile updated successfully!");
  };

  // Filtered Events
  const filteredEvents = myEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filter === "upcoming") {
      matchesFilter = isBefore(new Date(), parseISO(event.date));
    } else if (filter === "past") {
      matchesFilter = isBefore(parseISO(event.date), new Date());
    }

    return matchesSearch && matchesFilter;
  });

  // Dummy volunteer opportunities
  const volunteerOps = [
    {
      id: 1,
      title: "Food Distribution Drive",
      date: "2025-10-15",
      location: "Bandar Seri Begawan",
      description: "Help distribute meals to underprivileged families.",
    },
    {
      id: 2,
      title: "Tree Planting Day",
      date: "2025-10-20",
      location: "Tasek Lama Park",
      description: "Join us in planting 300 trees across the park.",
    },
  ];

  return (
    <div>
      <Navbar />

      <div className="dashboard">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <h2>Supporter Dashboard</h2>
          <ul>
            <li
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </li>
            <li
              className={activeTab === "events" ? "active" : ""}
              onClick={() => setActiveTab("events")}
            >
              My Events
            </li>
            <li
              className={activeTab === "donations" ? "active" : ""}
              onClick={() => setActiveTab("donations")}
            >
              My Donations
            </li>
            <li
              className={activeTab === "volunteers" ? "active" : ""}
              onClick={() => setActiveTab("volunteers")}
            >
              Volunteer Work
            </li>
            <li
              className={activeTab === "bookmarks" ? "active" : ""}
              onClick={() => setActiveTab("bookmarks")}
            >
              Bookmarks
            </li>
            <li
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </li>
          </ul>
        </aside>

        {/* Main */}
        <main className="dashboard-main">
          {/* Overview */}
          {activeTab === "overview" && (
            <div>
              <h3>👋 Hi {profile.name}, here’s your impact</h3>
              <div className="overview-metrics">
                <div className="metric-card">
                  <h4>{myEvents.length}</h4>
                  <p>Events Joined</p>
                </div>
                <div className="metric-card">
                  <h4>${donations.reduce((a, d) => a + d.amount, 0)}</h4>
                  <p>Total Donations</p>
                </div>
                <div className="metric-card">
                  <h4>{bookmarks.length}</h4>
                  <p>Bookmarks</p>
                </div>
              </div>

              <h4>🔔 Notifications</h4>
              <ul className="notifications">
                {notifications.length > 0 ? (
                  notifications.map((n) => <li key={n.id}>{n.message}</li>)
                ) : (
                  <li>No new notifications</li>
                )}
              </ul>
            </div>
          )}

          {/* My Events */}
          {activeTab === "events" && (
            <div>
              <h3>My Events</h3>
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filter={filter}
                setFilter={setFilter}
              />
              <div className="event-list">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                ) : (
                  <p>No events found.</p>
                )}
              </div>
            </div>
          )}

          {/* Donations */}
          {activeTab === "donations" && (
            <div>
              <h3>My Donations</h3>
              <div className="donation-list">
                {donations.length > 0 ? (
                  donations.map((d) => (
                    <DonationCard key={d.id} donation={d} />
                  ))
                ) : (
                  <p>No donations made yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Volunteer Work */}
          {activeTab === "volunteers" && (
            <div>
              <h3>Volunteer Opportunities</h3>
              <div className="volunteer-list">
                {volunteerOps.map((op) => (
                  <VolunteerCard key={op.id} opportunity={op} />
                ))}
              </div>
            </div>
          )}

          {/* Bookmarks */}
          {activeTab === "bookmarks" && (
            <div>
              <h3>My Bookmarks</h3>
              {bookmarks.length > 0 ? (
                <ul className="bookmark-list">
                  {bookmarks.map((b) => (
                    <li key={b.id}>
                      {b.type === "NGO" ? "🏢 NGO: " : "📅 Event: "}
                      {b.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No bookmarks yet.</p>
              )}
            </div>
          )}

          {/* Profile */}
          {activeTab === "profile" && (
            <div>
              <h3>My Profile</h3>
              <form className="profile-form" onSubmit={handleProfileUpdate}>
                <input
                  type="text"
                  value={editProfile.name}
                  onChange={(e) =>
                    setEditProfile({ ...editProfile, name: e.target.value })
                  }
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={editProfile.email}
                  onChange={(e) =>
                    setEditProfile({ ...editProfile, email: e.target.value })
                  }
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={editProfile.interests.join(", ")}
                  onChange={(e) =>
                    setEditProfile({
                      ...editProfile,
                      interests: e.target.value.split(","),
                    })
                  }
                  placeholder="Interests (comma separated)"
                />
                <button type="submit" className="btn">
                  Save Profile
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
